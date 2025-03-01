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
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String }
    }],
    averageRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("trainers", trainerSchema);
