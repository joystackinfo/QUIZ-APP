// Question and Score models to talk to the database
const Question = require("../models/question.model");
const Score = require("../models/score.model");

// --- GET ALL QUESTIONS (Admin sees all, no limit) ---
exports.getAllQuestions = async (req, res) => {
    try {
        // No limit here, admin sees every question in the database
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error getting questions", error });
    }
};

// --- ADD A NEW QUESTION ---
exports.addQuestion = async (req, res) => {
    try {
        // Get question, category, answers and explanation from the request body
        const { question, category, answers, explanation } = req.body;

        const newQuestion = new Question({
            question,
            category,
            answers,
            explanation
        });

        await newQuestion.save(); // save it to the database
        res.status(201).json({ message: "Question added!", data: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error });
    }
};

// --- EDIT A QUESTION ---
exports.updateQuestion = async (req, res) => {
    try {
        // :id in the URL tells me which question to update
        const { id } = req.params;
        const updates = req.body;

        // findByIdAndUpdate finds the question and updates it in one step
        // { new: true } means return the updated version, not the old one
        const updated = await Question.findByIdAndUpdate(id, updates, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question updated!", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating question", error });
    }
};

// --- DELETE A QUESTION ---
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Question.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question", error });
    }
};

// --- GET ALL SCORES ---
exports.getAllScores = async (req, res) => {
    try {
        // Sort by points highest first so admin sees top scores at the top
        const scores = await Score.find().sort({ points: -1 });
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: "Error getting scores", error });
    }
};

// --- DELETE A SCORE (delete a user from leaderboard) ---
exports.deleteScore = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Score.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Score not found" });
        }

        res.json({ message: "Score deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting score", error });
    }
};