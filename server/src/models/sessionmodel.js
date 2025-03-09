const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers", required: true },
    sessionName: { type: String, required: true },
    workoutType: { type: String, required: true },
    image : {type:String,required:true},
    date: { type: Date, required: true },
    maxParticipants: { type: Number, required: true },
    status: { type: String, enum: ["available", "completed"], default: "available" },
    workouts: [  
        {
            exercise: String,
            sets: Number,
            reps: Number
        }
    ]
});

module.exports = mongoose.model("sessions", sessionSchema);
