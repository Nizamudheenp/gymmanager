const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers", required: true },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "paid", "cancelled"], 
        default: "pending" 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("appointments", appointmentSchema);
