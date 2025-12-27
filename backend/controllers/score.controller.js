const score = require('../models/score.model');

const createScore = async (req, res) => {
     try{
        const { username, category, score } = req.body;

        const newScore = new score({
            username,
            category,
            score
        });

        await new score.save(); // Save new score document to database

        res.status(201).json({
            message: "Score saved successfully",  
            data: new score 
        }); // Respond for created score

    } catch (error) {
        res.status(500).json({
            message:"Error saving score",
            error:error.message
        }) // Internal Server Error
    }
}

const leaderboard = async (req, res) => {
    try{

    }
    catch (error) {

    }

};






















module.exports = {
    createScore
};