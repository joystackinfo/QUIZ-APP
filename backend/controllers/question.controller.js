const Question =  require("../models/question.model");

exports.getQuestions = async (req, res) => { 
    try {
        const { category} = req.query; // Get category from query parameters

      if(!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const questions = await Question.find({ category }).limit(10); // Give only 10 question for each category(cause each category has 15 question in the database)

        res.json(questions); // sends the questions as a json response

    } catch (error) {
       console.error("REAL ERROR: ", error);
        res.status(500)
        .json({ message: "Server error", error });
        
    };
}