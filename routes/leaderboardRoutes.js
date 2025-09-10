const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/leaderboardController');

router.post('/score', ctrl.postScore);           
router.get('/top', ctrl.getTop);              
router.get('/player/:id/rank', ctrl.getRank);   

module.exports = router;
