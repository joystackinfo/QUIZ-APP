const express = require('express');
const router = express.Router();

const { createScore , getLeaderboard } = require('../controllers/score.controller');

// Route to create a new score
router.post('/', createScore);

// Route to get leaderboard
router.get('/', getLeaderboard);

module.exports = router;
