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

const getLeaderboard = async (req, res) => {
    try{
        const {category} = req.query;
        const limit = 10;
    
        const filter = category ? {category} : {}; //filter if there is category in query

        const scores = await score.find(filter) // find scores based on filter

        .sort({ score: -1})
        .limit(limit);

        res.status(200).json({
            message: "Top scores leaderboard retrieved successfully",
            data: scores
        });

    }
    catch (error) {
        res.status(500).json({
            message: 'Error retrieving leaderboard',
            error: error.message
        });
    }

}

module.exports = {
    getLeaderboard,
    createScore
};