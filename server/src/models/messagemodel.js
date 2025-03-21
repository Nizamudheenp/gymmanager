const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderType: { type: String, enum: ["User", "Trainer"], required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverType: { type: String, enum: ["User", "Trainer"], required: true },
    message: { type: String, required: true }
}, { timestamps: true }); 


module.exports = mongoose.model("messages", messageSchema);

