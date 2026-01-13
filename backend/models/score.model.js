const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    username: {
         type: String, 
         required: true,
         unique: true,
         trim: true
    },
    category:{
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Score', scoreSchema);