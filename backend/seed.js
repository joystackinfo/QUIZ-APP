import mongoose from "mongoose";
import dotenv from "dotenv";

//Data Questions
import literatureQuestions from "./data/Literature.js";
import citizenshipQuestions from "./data/citizenship.js";
import governmentQuestions from "./data/government.js";
import digitalTechQuestions from "./data/digitaltechnology.js";
// Import Question model
import Question from "./models/Question.js";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Function to seed questions into the database
async function seedQuestions() { 
    try {
        await Question.deleteMany({}); // Clear existing questions
        console.log("Old questions cleared");
    } catch (err) {
        console.error("Error clearing questions:", err);
    }
    const allQuestions = [
        ...literatureQuestions,
        ...citizenshipQuestions,
        ...governmentQuestions,
        ...digitalTechQuestions
    ]; //.....(Spreadsa all the questions inside into one array)
    await Question.insertMany(allQuestions); // Insert all questions into the database
    console.log("Questions seeded successfully");
}

seedQuestions();
