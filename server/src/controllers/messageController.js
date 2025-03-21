const MessageDB = require('../models/messagemodel')
const TrainerDB = require("../models/trainermodel");
const UserDB = require('../models/usermodel');

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

        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required." });
        }

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

        console.log("Fetching messages...");
        console.log("Sender ID:", senderId);
        console.log("Sender Type:", senderType);
        console.log("Receiver ID:", receiverId);

        const messages = await MessageDB.find({
            $or: [
                { senderId, receiverId, senderType, receiverType: senderType === "User" ? "Trainer" : "User" },
                { senderId: receiverId, receiverId: senderId, senderType: senderType === "User" ? "Trainer" : "User" }
            ]
        }).sort({ createdAt: 1 }); // ✅ Fix sorting field

        return res.status(200).json({ success: true, messages });

    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to retrieve messages", error: error.message });
    }
};

exports.getContacts = async (req, res) => {
    try {
        let contacts = [];

        if (req.user) {
            // Fetch contacts from messages
            const messages = await MessageDB.find({
                $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
            }).distinct("receiverId");

            const sentMessages = await MessageDB.find({
                $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
            }).distinct("senderId");

            const uniqueContacts = [...new Set([...messages, ...sentMessages])];

            // 🔹 If no messages, fetch assigned trainer
            if (uniqueContacts.length === 0) {
                const trainer = await TrainerDB.findOne({ clients: req.user.id }, "username _id");
                if (trainer) contacts.push(trainer);
            } else {
                contacts = await TrainerDB.find({ _id: { $in: uniqueContacts } }, "username _id");
            }

        } else if (req.trainer) {
            // Fetch contacts from messages
            const messages = await MessageDB.find({
                $or: [{ senderId: req.trainer.id }, { receiverId: req.trainer.id }]
            }).distinct("receiverId");

            const sentMessages = await MessageDB.find({
                $or: [{ senderId: req.trainer.id }, { receiverId: req.trainer.id }]
            }).distinct("senderId");

            const uniqueContacts = [...new Set([...messages, ...sentMessages])];

            // 🔹 If no messages, fetch assigned users
            if (uniqueContacts.length === 0) {
                contacts = await UserDB.find({ _id: { $in: req.trainer.clients } }, "username _id");
            } else {
                contacts = await UserDB.find({ _id: { $in: uniqueContacts } }, "username _id");
            }
        } else {
            return res.status(403).json({ message: "Unauthorized request." });
        }

        res.status(200).json({ success: true, contacts });

    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
    }
};