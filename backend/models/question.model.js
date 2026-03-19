const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    text: String,
    correct: Boolean
})
const questionSchema = new mongoose.Schema({
    category: String,
    question: String,
    answer: [answerSchema] // Array of answer objects
    explanation: String
})


const Question = mongoose.model("Question", questionSchema);