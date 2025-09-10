function yyyyymmdd(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${dd}`;
}

function secondsUntilNextMidnight() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0);
    return Math.ceil((next - now) / 1000);
}

function leaderboardKey({ period = 'daily', gameMode = 'global', region = 'all' } = {}) {
    gameMode = gameMode || 'global';
    region = region || 'all';
    if (period === 'daily') {
        return `leaderboard:daily:${yyyyymmdd()}:${gameMode}:${region}`;
    }
    if (period === 'alltime') {
        return `leaderboard:alltime:${gameMode}:${region}`;
    }
    if (period === 'weekly') {
        const now = new Date();
        const onejan = new Date(now.getFullYear(), 0, 1);
        const week = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return `leaderboard:weekly:${now.getFullYear()}W${week}:${gameMode}:${region}`;
    }
    return `leaderboard:${period}:${gameMode}:${region}`;
}

function roomName({ period = 'daily', gameMode = 'global', region = 'all' } = {}) {
    // socket.io room name (no date) — clients subscribe with same params
    return `lbroom:${period}:${gameMode}:${region}`;
}

module.exports = { leaderboardKey, secondsUntilNextMidnight, roomName };
