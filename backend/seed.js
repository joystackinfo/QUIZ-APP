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



   
seedQuestions();
