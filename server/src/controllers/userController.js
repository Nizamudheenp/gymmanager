const AppointmentDB = require('../models/appointmentmodel')
const WorkoutDB = require('../models/workoutmodel')

exports.bookSession = async (req,res)=>{
    try {
    const {trainerId,date}=req.body
    const userId = req.user.id

    const newAppointment = await AppointmentDB.create({
            userId,
            trainerId,
            date,
            status: "pending"
    })
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