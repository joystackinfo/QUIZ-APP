const Question =  require("../models/question.model");

exports.getQuestions = async (req, res) => { 
    try {
        const { category} = req.query; // Get category from query parameters

      if(!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const question = await Question.find({ category }) //Find questions based on category
        .limit(10); // Give only 10 question for each category(cause each category has 15 question in the database)

        res.json(question); // sends the question as a json response

    } catch (error) {
        res.status(500)
        .json({ message: "Server error", error });
        
    };
}