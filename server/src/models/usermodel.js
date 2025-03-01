const mongoose = require("mongoose")

const progressSchema = new mongoose.Schema({
    weight: Number,
    bodyFat: Number,
    bmi: Number,
    muscleMass: Number,
    loggedAt: { type: Date, default: Date.now }
})

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    fitnessData: {
        height: Number,
        weight: Number,
        exerciseFrequency: String,
    },
    progress: [progressSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("users", userSchema);

