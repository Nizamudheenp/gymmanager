const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "trainers", required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "appointments", required: true }, // ✅ Ensure appointment reference
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    method: { type: String, enum: ["Stripe", "Cash"], required: true },
    paymentIntentId: { type: String, required: true }, // ✅ Add paymentIntentId
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("payments", paymentSchema);
