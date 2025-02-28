const MessageDB = require('../models/messagemodel')

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, receiverType, message } = req.body;

        if (!receiverId || !receiverType || !message) {
            return res.status(400).json({ message: "Receiver ID, type, and message are required." });
        }

        let senderId, senderType;

        if (req.user) {  
            senderId = req.user.id;
            senderType = "User";
        } else if (req.trainer) {  
            senderId = req.trainer.id;
            senderType = "Trainer";
        } else {
            return res.status(403).json({ message: "Unauthorized sender." });
        }

        const newMessage = await MessageDB.create({
            senderId,
            senderType,
            receiverId,
            receiverType,
            message
        });

        res.status(201).json({ message: "Message sent successfully", data: newMessage });

    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error: error.message });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const receiverId = req.params.receiverId;
        let senderId, senderType;

        if (req.user) {
            senderId = req.user.id;
            senderType = "User";
        } else if (req.trainer) {
            senderId = req.trainer.id;
            senderType = "Trainer";
        } else {
            return res.status(403).json({ message: "Unauthorized request." });
        }

        const messages = await MessageDB.find({
            $or: [
                { senderId, receiverId, senderType, receiverType: senderType === "User" ? "Trainer" : "User" },
                { senderId: receiverId, receiverId: senderId, senderType: senderType === "User" ? "Trainer" : "User" }
            ]
        }).sort({ timestamp: 1 });

        if (!messages.length) {
            return res.status(404).json({ message: "No messages found." });
        }

        res.status(200).json({ success: true, messages });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve messages", error: error.message });
    }
};

