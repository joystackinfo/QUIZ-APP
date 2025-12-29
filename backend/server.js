const express = require('express')
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors"); 
const scoreRoutes = require('./routes/score.route');

const mongoose = require('mongoose');
const app = express()
require('dotenv').config();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", scoreRoutes); // Use score routees

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public"))); 


// Test route
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// connect to mongodb database using mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' Connected to Database');
    app.listen(process.env.PORT, () => {
      console.log(` Server is running on port ${process.env.PORT}`);
    });
  }
)

  .catch(err => {
    console.error(' Connection failed', err);
  });