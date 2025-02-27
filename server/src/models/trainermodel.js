const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    certifications: [String], 
    verified: { type: Boolean, default: false }, 
    clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("trainers", trainerSchema);
