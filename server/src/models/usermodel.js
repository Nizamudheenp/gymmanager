const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fitnessData: {
        height: Number,
        weight: Number,
        exerciseFrequency: String,
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", userSchema);

