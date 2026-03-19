const mongoose = require("mongoose");
require('dotenv').config();
const Question = require("./models/question.model");


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected for seeding"))
  .catch(err => console.log(err));