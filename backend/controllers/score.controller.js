const Score = require('../models/score.model');

const createScore = async (req, res) => {
    try {
        const { username, category, score } = req.body; // score = correct answers from frontend
        const points = score * 5; // calculate points

        const newScore = new Score({ username, category, points });
        await newScore.save();

        res.status(201).json({
            message: "Score saved successfully",
            data: newScore
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving score",
            error: error.message
        });
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const scores = await Score.find(filter).sort({ points: -1 });

        res.status(200).json({
            message: "Leaderboard retrieved successfully",
            data: scores
        });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving leaderboard",
            error: error.message
        });
    }
}

module.exports = {
    getLeaderboard,
    createScore
};
