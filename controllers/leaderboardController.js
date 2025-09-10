const Player = require('../models/Player');
const leaderboardService = require('../services/leaderboardService');

exports.postScore = async (req, res) => {
    try {
        const { playerId, delta, gameMode, region, period } = req.body;
        if (!playerId || typeof delta !== 'number') {
            return res.status(400).json({ error: 'playerId and numeric delta required' });
        }

        // Ensure player profile exists (lightweight)
        let player = await Player.findOne({ playerId });
        if (!player) {
            player = await Player.create({ playerId, name: playerId, region: region || 'all' });
        }

        const { key, score } = await leaderboardService.updateScore(playerId, delta, { gameMode, region, period });
        const rank = await leaderboardService.getPlayerRank(playerId, { gameMode, region, period });

        res.json({ playerId, score, rank, key });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getTop = async (req, res) => {
    try {
        const { gameMode, region, period, limit } = req.query;
        const top = await leaderboardService.getTop({
            gameMode, region, period, limit: Number(limit) || 10
        });
        res.json(top);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.getRank = async (req, res) => {
    try {
        const playerId = req.params.id;
        const { gameMode, region, period } = req.query;
        const r = await leaderboardService.getPlayerRank(playerId, { gameMode, region, period });
        if (!r) return res.status(404).json({ error: 'No rank found' });
        res.json(r);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
