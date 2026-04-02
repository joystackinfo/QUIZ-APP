// backend/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();


// Data questions
const literatureQuestions = require("./data/Literature");
const citizenshipQuestions = require("./data/citizenship");
const governmentQuestions = require("./data/government");
const digitalTechQuestions = require("./data/digitaltechnology");

// Question model
const Question = require("./models/question.model");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

// Function to seed questions
async function seedQuestions() {
    try {
        await Question.deleteMany({});
        console.log("Old questions cleared");

        const allQuestions = [
            ...literatureQuestions,
            ...citizenshipQuestions,
            ...governmentQuestions,
            ...digitalTechQuestions
        ];

        await Question.insertMany(allQuestions);
        console.log("Questions seeded successfully");
    } catch (err) {
        console.error("Seeding error:", err);
    } finally {
        mongoose.disconnect();
    }
}

seedQuestions();