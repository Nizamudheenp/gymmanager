const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers" },
    exercises: [
        {
            name: { type: String, required: true },
            sets: { type: Number, required: true }, 
            reps: { type: Number, required: true }, 
        }
    ],
    status: { 
        type: String, 
        enum: ["pending", "completed"], 
        default: "pending" 
    }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("workouts", workoutSchema);

