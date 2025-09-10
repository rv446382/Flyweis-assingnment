const redis = require('../config/redis');
const { leaderboardKey, secondsUntilNextMidnight } = require('../utils/keyBuilder');

async function updateScore(playerId, delta, { gameMode = 'global', region = 'all', period = 'daily' } = {}) {
    const key = leaderboardKey({ period, gameMode, region });
    // increment score (delta can be negative)
    const newScoreStr = await redis.zincrby(key, delta, playerId);
    // ensure daily key has TTL set to next midnight
    if (period === 'daily') {
        const ttl = await redis.ttl(key);
        if (ttl === -1) {
            const sec = secondsUntilNextMidnight();
            await redis.expire(key, sec);
        }
    }
    return { key, score: Number(newScoreStr) };
}

async function getTop({ gameMode = 'global', region = 'all', period = 'daily', limit = 10 } = {}) {
    const key = leaderboardKey({ period, gameMode, region });
    const cacheKey = `cache:top:${key}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const arr = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES');
    const result = [];
    for (let i = 0; i < arr.length; i += 2) {
        result.push({ playerId: arr[i], score: Number(arr[i + 1]), rank: (i / 2) + 1 });
    }
    // short cache to reduce hot spin on heavy read bursts
    await redis.setex(cacheKey, 2, JSON.stringify(result));
    return result;
}

async function getPlayerRank(playerId, { gameMode = 'global', region = 'all', period = 'daily' } = {}) {
    const key = leaderboardKey({ period, gameMode, region });
    const rank = await redis.zrevrank(key, playerId);
    if (rank === null) return null;
    const scoreStr = await redis.zscore(key, playerId);
    return { playerId, rank: rank + 1, score: Number(scoreStr) };
}

module.exports = { updateScore, getTop, getPlayerRank };
