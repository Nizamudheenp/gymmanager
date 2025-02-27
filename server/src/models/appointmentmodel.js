const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers", required: true },
    date: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "completed", "cancelled"], 
        default: "pending" 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("appointments", appointmentSchema);
