const score = require('../models/score.model');

const createScore = async (req, res) => {
     try{
        const { username, category, score } = req.body;

        const newScore = new score({
            username,
            category,
            score
        });

        await new score.


    
    
    
    }


}