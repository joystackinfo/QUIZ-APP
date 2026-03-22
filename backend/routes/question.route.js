const express = require('express');
const router = express.Router();

const { getQuestions } = require("../controllers/question.controller");

// Routes to get questions
router.get("/", getQuestions); // Get questions based on category

module.exports = router;