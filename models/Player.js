const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    playerId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        default: 'all',
        index: true
    },
    meta: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', PlayerSchema);
