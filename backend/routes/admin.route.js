const express = require('express');
const router = express.Router();

// Brings all the fucntions fron the admin controller.
const {
    getAllQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    getAllScores,
    deleteScore
} = require("../controllers/admin.controller");

// --- QUESTION ROUTES ---

// POST verify admin password
router.post("/verify-password", (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});


// GET all questions  http://localhost:3000/api/admin/questions
router.get("/questions", getAllQuestions);

// POST add a new question  http://localhost:3000/api/admin/questions
router.post("/questions", addQuestion);

// PUT edit a question by id  http://localhost:3000/api/admin/questions/123
router.put("/questions/:id", updateQuestion);

// DELETE a question by id  http://localhost:3000/api/admin/questions/123
router.delete("/questions/:id", deleteQuestion);

// --- SCORE ROUTES ---

// GET all scores http://localhost:3000/api/admin/scores
router.get("/scores", getAllScores);

// DELETE a score by id http://localhost:3000/api/admin/scores/123
router.delete("/scores/:id", deleteScore);

module.exports = router;