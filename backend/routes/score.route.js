const express = require('express');
const router = express.Router();

const { createScore } = require('../controllers/score.controller');

// Route to create a new score
router.post("/scores", createScore);






module.exports = router;