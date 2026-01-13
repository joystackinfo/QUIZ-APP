const Score = require('../models/score.model');

// --- CREATE SCORE ---
const createScore = async (req, res) => {
  try {
    const { username, category, points } = req.body;

       // validation
    if (!username || !category || typeof points !== 'number') {
      return res.status(400).json({
        message: "Invalid score data"
      });
    }   
  
 const normalizedUsername = username.trim().toLowerCase(); // normalize username
 
    // check if it exists already in this category
const exists = await Score.findOne({ username: normalizedUsername, category });
if (exists) {
  return res.status(400).json({ message: "Username already exists in this category" });
}

    // Cap points at 150
    const cappedPoints = Math.min(points, 150); // maximum points allowed

    const newScore = new Score({
      username: normalizedUsername,
      category,
      points: cappedPoints
    });

    await newScore.save();

    res.status(201).json({
      message: "Score saved successfully",
      data: newScore
    });

  } catch (error) {
   if (error.code === 11000) { // duplicate key error
      return res.status(409).json({
        message: "Username already exists"
      });
    }


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

    const scores = await Score.aggregate([
      { $match: match },
      {
        $group: {
          _id: { username: "$username", category: "$category" },
          username: { $first: "$username" },
          category: { $first: "$category" },
          points: { $max: "$points" },
          updatedAt: { $max: "$updatedAt" }
        }
      },
      { $sort: { points: -1, updatedAt: -1 } }
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
  createScore,
  getLeaderboard
};
