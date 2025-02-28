const AppointmentDB = require('../models/appointmentmodel')
const WorkoutDB = require('../models/workoutmodel')
const getNutrition = require('../utilities/nutritionfetch')
const NutritionDB = require('../models/nutritionmodel')
const TrainerDB = require("../models/trainermodel"); 
const SessionDB = require('../models/sessionmodel')


exports.availableTrainers = async (req,res)=>{
    try {
        const trainers = await TrainerDB.find({verified:true})
        if(!trainers){
           return res.status(404).json({message:"No Trainers Available"})
        }
        res.status(200).json({trainers})
    } catch (error) {
        res.status(500).json({ message: "trainers fetching failed", error: error.message });  
    }
}

exports.bookTraining = async (req,res)=>{
    try {
    const {trainerId,date}=req.body
    const userId = req.user.id

    const newAppointment = await AppointmentDB.create({
            userId,
            trainerId,
            date,
            status: "pending"
    })
    await TrainerDB.findByIdAndUpdate(trainerId, {
        $addToSet: { clients: userId } 
    });

    res.status(201).json({  message: "session booked", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });

    }   
}
exports.getAllBookings = async (req,res)=>{
    try {
        const appointments = await AppointmentDB.find({ userId: req.user.id }).populate("trainerId", "username email"); 
        if (!appointments.length) {
            return res.status(404).json({ message: "No bookings found for this user." });
        }
    res.json({  appointments });
    } catch (error) {
        res.status(500).json({  message: "Failed to get user appointments", error: error.message });

    }
    
}

exports.getworkouts = async(req,res)=>{
    try {
        const workouts = await WorkoutDB.find({userId:req.user.id}).populate("trainerId", "username email")
        if (workouts.length === 0) {
            return res.status(404).json({ message: "No workouts assigned" });
        }
        res.json({workouts})
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch workouts", error: error.message });

    }
}

exports.updateStatus = async (req,res)=>{
    try {
        const {status} = req.body
        if(!status){
           return res.status(400).json({message:"status is required"})
        }
       const workout = await WorkoutDB.findById(req.params.id) 
       if(!workout){
        return res.status(404).json({message:"workout not found"})
       }
       if(workout.userId.toString() !== req.user.id){
        return res.status(403).json({ message: "Not authorized" });
       }
       workout.status = status
       await workout.save()
       res.json({  message: `Workout marked as ${status}`, workout });

    } catch (error) {
        res.status(500).json({ message: "Failed to update workout", error: error.message });

    }
}

exports.logMeal = async (req,res)=>{
    try {
        const {foodName, portionSize} = req.body;
        if(!foodName && !portionSize){
            return res.status(400).json({message:"foodname and portion size are required"})
        }
        const nutritionData = await getNutrition(foodName,portionSize)
        if(!nutritionData){
            return res.status(404).json({ message: "Food item not found in USDA database." });
        }
        let nutritionLog = await NutritionDB.findOne({ userId: req.user.id });
        if (!nutritionLog) {
            nutritionLog = new NutritionDB({ userId: req.user.id, meals: [] });
        }
        nutritionLog.meals.push({
            foodName,
            portionSize,
            calories: nutritionData.calories,
            protein: nutritionData.protein,
            carbs: nutritionData.carbs,
            fats: nutritionData.fats
        });

        await nutritionLog.save();
        res.status(201).json({  message: "Meal logged successfully", nutrition: nutritionLog });

    } catch (error) {
        res.status(500).json({ message: "Failed to log meal", error: error.message });
  
    }
}

exports.getAvailableSessions = async (req, res) => {
    try {
        const sessions = await SessionDB.find({ status: "available" })
            .populate("trainerId", "username email");

        if (!sessions.length) {
            return res.status(404).json({ message: "No available sessions found" });
        }

        res.json({ sessions });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
    }
}

exports.bookSession  =  async (req,res)=>{
    try {
        const { sessionId } = req.body
        const userId = req.user.id

        const session = await SessionDB.findById(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session not found" })
        }

        const existingAppointment = await AppointmentDB.findOne({ userId, sessionId })
        if (existingAppointment) {
            return res.status(400).json({ message: "You have already booked this session" })
        }

        const newAppointment = await AppointmentDB.create({
            userId,
            trainerId: session.trainerId,
            sessionId,
            date: session.date,
            status: "pending"
        })

        const assignedWorkouts = session.workouts.map(workout => ({
            userId,
            trainerId: session.trainerId,
            exercise: workout.exercise,
            sets: workout.sets,
            reps: workout.reps,
            status: "pending"  
        }))
        await WorkoutDB.insertMany(assignedWorkouts)
        await TrainerDB.findByIdAndUpdate(session.trainerId, {
            $addToSet: { clients: userId } 
        });

        res.status(201).json({ message: "Session booked successfully", appointment: newAppointment })  
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
 
    }
}

