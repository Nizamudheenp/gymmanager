const TrainerDB = require("../models/trainermodel"); 
const UserDB =require('../models/usermodel')

exports.trainerApproval = async (req,res)=>{
    try {
        const trainer = await TrainerDB.findById(req.params.id)
        if (!trainer){
             return res.status(404).json({ message: "Trainer not found" });
        }
        trainer.verified = true;
        await trainer.save();
        res.json({ success: true, message: "Trainer approved successfully", trainer }); 
    } catch (error) {
        res.status(500).json({ message: "Trainer approval failed", error: error.message });

    }
    
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserDB.find().select("-password")
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message })
    }
}

exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await TrainerDB.find().select("-password")
        res.json({ trainers })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch trainers", error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        await UserDB.findByIdAndDelete(id)
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message })
    }
}

exports.deleteTrainer  = async (req,res)=>{
    try {
      const {id} =  req.params
      await TrainerDB.findByIdAndDelete(id) 
      res.json({ message: "Trainer deleted successfully" })
    } catch (error) {
        res.status(500).json({message:"Failed to delete trainer",error:error.message})
    }
}

exports.getAllUserProgress = async (req, res) => {
    try {
        const users = await UserDB.find().select("name email progress")
        res.json({ users })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user progress", error: error.message })
    }
}


