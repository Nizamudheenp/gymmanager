const AppointmentDB = require('../models/appointmentmodel');
const WorkoutDB = require('../models/workoutmodel')
const NutritionDB = require('../models/nutritionmodel')


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