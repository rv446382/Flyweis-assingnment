const leaderboardService = require('../services/leaderboardService');
const { roomName } = require('../utils/keyBuilder');

module.exports = function initSockets(io) {
    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);

        socket.on('subscribe', async ({ gameMode = 'global', region = 'all', period = 'daily', limit = 10 } = {}) => {
            const room = roomName({ period, gameMode, region });
            socket.join(room);
            const top = await leaderboardService.getTop({ gameMode, region, period, limit });
            socket.emit('leaderboard:init', { room, players: top });
        });

        // Clients can also send score updates via sockets (server must validate/auth in production)
        socket.on('updateScore', async ({ playerId, delta, gameMode = 'global', region = 'all', period = 'daily' } = {}) => {
            if (!playerId || typeof delta !== 'number') return;
            const { score } = await leaderboardService.updateScore(playerId, delta, { gameMode, region, period });
            const top = await leaderboardService.getTop({ gameMode, region, period, limit: 10 });
            const room = roomName({ period, gameMode, region });
            io.to(room).emit('leaderboard:update', { playerId, score, players: top });
        });

        socket.on('disconnect', () => {
            // automatic room leave
            console.log('socket disconnected', socket.id);
        });
    });
};
