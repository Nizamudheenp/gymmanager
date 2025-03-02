const AppointmentDB = require('../models/appointmentmodel');
const WorkoutDB = require('../models/workoutmodel')
const NutritionDB = require('../models/nutritionmodel')
const SessionDB = require('../models/sessionmodel')
const TrainerDB = require("../models/trainermodel"); 
const UserDB = require('../models/usermodel');
const uploadCloudinary = require('../utilities/imageupload');


exports.updateBooking= async (req,res)=>{
    try {
    const { status } = req.body
    const appointmentId = req.params.id;

    if(!status){
        return res.status(400).json({message:"status is required"})
     }

    const appointment = await AppointmentDB.findById(appointmentId)
    if (!appointment){
        return res.status(404).json({ message: "Appointment not found" });
    } 
    if (appointment.trainerId.toString() !== req.trainer.id) {
        return res.status(403).json({ message: "Not authorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({  message: `Session ${status}`, appointment });    
    } catch (error) {
        res.status(500).json({message: "booking updation failed", error: error.message });
 
    }

}

exports.getAllBookings = async (req,res)=>{
    try {
        const appointments = await AppointmentDB.find({ trainerId: req.trainer.id })
        .populate("userId", "username email"); 
        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this trainer." });
        }

    res.json({  appointments });
    } catch (error) {
        res.status(500).json({  message: "Failed to get trainer appointments", error: error.message });

    }
    
}

exports.assignWorkouts = async (req,res)=>{
    try {
        const {userId,exercises} =req.body
        const trainerId = req.trainer.id
        if(!userId || !exercises){
          return  res.status(400).json({message:"user id and exercises are required"})
        }
        const newWorkout = await WorkoutDB.create({
            trainerId,
            userId,
            exercises,
            status:"pending"
        })

        res.status(201).json({message:"workouts assigned successfully ",workout : newWorkout})

    } catch (error) {
        res.status(500).json({message:"Failed to assign workouts", error:error.message})
    }
}

exports.deleteWorkout = async(req,res)=>{
    try {
        const workout = await WorkoutDB.findById(req.params.id)
        if (!workout) {
            return res.status(404).json({ message: "Workout not found" })
        }
        if (workout.trainerId.toString() !== req.trainer.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await WorkoutDB.findByIdAndDelete(req.params.id)
        res.status(201).json({message:"workout deleted successfully"})

    } catch (error) {
        res.status(500).json({message:"Failed to delete workouts", error:error.message})
 
    }
}

exports.viewUserNutrition= async(req,res)=>{
    try {
       const {userId} = req.params
       const userNutrition =  await NutritionDB.findOne(userId)

       if(!userNutrition){
        return res.status(404).json({message:"no nutrion found for the user"})
       }
       res.status(200).json({ nutrition: userNutrition });
    } catch (error) {
      res.status(500).json({message:"failed fecth nutrition logs"})  
    }
}

exports.createSession = async (req,res)=>{
    try {
        const {sessionName, workoutType, date, maxParticipants,workouts }= req.body
        const trainerId = req.trainer.id;
        if(!req.file){
            return res.status(404).json({message:"image not found"})
        }
        const cloudinaryResponse = await uploadCloudinary(req.file.path)
        const newSession = await SessionDB.create({
            trainerId,
            sessionName,
            workoutType,
            date,
            maxParticipants,
            image:cloudinaryResponse,
            workouts 
        })
        res.status(201).json({ message: "Session created successfully", session: newSession });

    } catch (error) {
        res.status(500).json({ message: "Failed to create session", error: error.message });
  
    }
}

exports.getClientProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const trainerId = req.trainer.id;

        const user = await UserDB.findById(userId).select("progress");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isClient = await TrainerDB.findOne({ _id: trainerId, clients: userId });
        if (!isClient) {
            return res.status(403).json({ message: "You are not authorized to view this user's progress." });
        }

        res.json({ progress: user.progress });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve progress", error: error.message });
    }
};
