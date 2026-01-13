const Score = require('../models/score.model');

// --- CREATE SCORE ---
const createScore = async (req, res) => {
  try {
    const { username, category, points } = req.body; // points = correct answers from frontend

     if (points > 150) {
      points = 150;
    } // cap at 150 points

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
};

// --- GET LEADERBOARD ---
const getLeaderboard = async (req, res) => {
  try {
    const { category } = req.query;
    const match = category ? { category } : {};

    // ✅ Aggregation: keep best score per user per category
    const scores = await Score.aggregate([  // aggregation pipeline
      { $match: match },
      {
        $group: {
          _id: { username: "$username", category: "$category" }, // group by username and category
          username: { $first: "$username" },
          points: { $max: "$points" },       // best score
          updatedAt: { $max: "$updatedAt" }  // latest among best
        }
      },
      { $sort: { points: -1, updatedAt: -1 } } // sort by points, then latest
    ]);

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
};

module.exports = {
  getLeaderboard,
  createScore
};