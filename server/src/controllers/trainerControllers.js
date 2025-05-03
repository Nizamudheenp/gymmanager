const AppointmentDB = require('../models/appointmentmodel');
const WorkoutDB = require('../models/workoutmodel')
const NutritionDB = require('../models/nutritionmodel')
const SessionDB = require('../models/sessionmodel')
const TrainerDB = require("../models/trainermodel");
const UserDB = require('../models/usermodel');
const uploadCloudinary = require('../utilities/uploadCloudinary');


exports.updateBooking = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const trainerId = req.trainer.id;

        const appointment = await AppointmentDB.findOne({
            _id: appointmentId,
            trainerId: trainerId
        });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = "confirmed";
        await appointment.save();

        res.json({ message: "Appointment approved successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
    }

}

exports.getAllBookings = async (req, res) => {
    try {
        const appointments = await AppointmentDB.find({ trainerId: req.trainer.id })
            .populate("userId", "username email");
        if (!appointments.length) {
            return res.status(404).json({ message: "No appointments found for this trainer." });
        }

        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Failed to get trainer appointments", error: error.message });

    }

}

exports.assignWorkouts = async (req, res) => {
    try {
        const { userId, exercises } = req.body
        const trainerId = req.trainer.id

        if (!userId || !exercises || exercises.length === 0) {
            return res.status(400).json({ message: "User ID and at least one exercise are required" });
        }

        let existingWorkout = await WorkoutDB.findOne({ userId, trainerId });
        if (existingWorkout) {
            existingWorkout.exercises.push(...exercises);
            await existingWorkout.save()
            return res.status(200).json({ message: "Workout updated successfully", workout: existingWorkout });

        } else {

            const newWorkout = await WorkoutDB.create({
                trainerId,
                userId,
                exercises,
                status: "pending"
            })
            return res.status(201).json({ message: "workouts assigned successfully ", workout: newWorkout })

        }



    } catch (error) {
        res.status(500).json({ message: "Failed to assign workouts", error: error.message })

    }
}

exports.getUserWorkouts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const trainerId = req.trainer.id;

        const workouts = await WorkoutDB.find({ trainerId, userId });

        if (!workouts.length) {
            return res.status(404).json({ message: "No workouts found for this user" });
        }
        const formattedWorkouts = workouts.flatMap(workout => workout.exercises);

        res.json({ workouts: formattedWorkouts });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch workouts", error: error.message });
    }
};

exports.deleteWorkout = async (req, res) => {
    try {
        const { exerciseId } = req.params;


        const workout = await WorkoutDB.findOne({ "exercises._id": exerciseId });

        if (!workout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        workout.exercises = workout.exercises.filter(ex => ex._id.toString() !== exerciseId);
        await workout.save();

        res.json({ message: "Exercise deleted successfully", workout });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





exports.viewUserNutrition = async (req, res) => {
    try {
        const { userId } = req.params
        const userNutrition = await NutritionDB.findOne({ userId: userId })

        if (!userNutrition) {
            return res.status(404).json({ message: "no nutrion found for the user" })
        }
        res.status(200).json({ nutrition: userNutrition });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.createSession = async (req, res) => {
    try {
        const { sessionName, workoutType, date, maxParticipants } = req.body
        const trainerId = req.trainer.id;
        if (!req.file) {
            return res.status(404).json({ message: "Image is required" })
        }
        let cloudinaryResponse;
        try {
            cloudinaryResponse = await uploadCloudinary(req.file.path);
        } catch (error) {
            console.error("Cloudinary upload failed:", error);
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const newSession = await SessionDB.create({
            trainerId,
            sessionName,
            workoutType,
            date,
            maxParticipants,
            image: cloudinaryResponse,
            workouts:[],
            bookings: []
        })
        res.status(201).json({ message: "Session created successfully", session: newSession });

    } catch (error) {
        res.status(500).json({ message: "Failed to create session", error: error.message });
        console.error("Failed to create session:", error.message);


    }
}
exports.approveSessionRequest = async (req, res) => {
    try {
        const { sessionId, userId, approvalStatus } = req.body;
        const trainerId = req.trainer.id;

        const session = await SessionDB.findById(sessionId);
        if (!session || session.trainerId.toString() !== trainerId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const booking = session.bookings.find(b => b.userId.toString() === userId);
        if (!booking) return res.status(404).json({ message: "Booking request not found" });
        if (booking.status === approvalStatus) {
            return res.status(400).json({ message: `User is already ${approvalStatus}` });
        }

        const approvedCount = session.bookings.filter(b => b.status === "approved").length;
        if (approvalStatus === "approved" && approvedCount >= session.maxParticipants) {
            return res.status(400).json({ message: "Session is full. Cannot approve more users." });
        }

        booking.status = approvalStatus;
        await session.save();

        res.status(200).json({ message: `User ${approvalStatus} successfully.` });
    } catch (error) {
        res.status(500).json({ message: "Approval failed", error: error.message });
    }
};

exports.addWorkoutToSession  = async (req,res)=>{
    try {
        const {sessionId, workouts}= req.body
        const trainerId = req.trainer.id
        const session = await SessionDB.findById(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.trainerId.toString() !== trainerId) {
            return res.status(403).json({ message: "Unauthorized to modify this session" });
        }
        const approvedUsers = session.bookings.filter(b => b.status === "approved");
        if (approvedUsers.length === 0) {
            return res.status(400).json({ message: "No approved users yet. Cannot add workouts." });
        }

        if (!Array.isArray(workouts) || workouts.length === 0) {
            return res.status(400).json({ message: "Invalid workout data. Provide an array of workouts." });
        }
        
        workouts.forEach(workout => {
            const existingWorkout = session.workouts.find(w => w.exercise.toLowerCase() === workout.exercise.toLowerCase());
            if (!existingWorkout) {
                session.workouts.push(workout);
            }
        });
        await session.save();
        res.status(200).json({ message: "Workouts added successfully", session });

    } catch (error) {
        res.status(500).json({ message: "Failed to add workouts", error: error.message });

    }
}


exports.deleteWorkoutFromSession = async (req, res) => {
    try {
        const { sessionId, workoutIndex } = req.body;
        const trainerId = req.trainer.id;

        const session = await SessionDB.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.trainerId.toString() !== trainerId) {
            return res.status(403).json({ message: "Unauthorized to modify this session" });
        }

        if (workoutIndex < 0 || workoutIndex >= session.workouts.length) {
            return res.status(400).json({ message: "Invalid workout index" });
        }

        session.workouts.splice(workoutIndex, 1);  
        await session.save();

        res.status(200).json({ message: "Workout deleted successfully", session });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete workout", error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const trainerId = req.trainer.id;

        const session = await SessionDB.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.trainerId.toString() !== trainerId) {
            return res.status(403).json({ message: "Unauthorized to delete this session" });
        }

        await SessionDB.findByIdAndDelete(sessionId);
        res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete session", error: error.message });
    }
};

exports.getTrainerSessions = async (req, res) => {
    try {
        const trainerId = req.trainer.id;
        const currentDate = new Date();

        await SessionDB.deleteMany({ trainerId, date: { $lt: new Date(currentDate.setDate(currentDate.getDate() - 1)) } });

        const sessions = await SessionDB.find({ trainerId }).populate('bookings.userId','username').exec()
        res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error fetching trainer sessions:", error);
        res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
    }
};



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

exports.removeClient = async (req, res) => {
    try {
        const trainerId = req.trainer.id;
        const userId = req.params.userId;

        const appointment = await AppointmentDB.findOneAndDelete({ trainerId, userId });

        if (!appointment) {
            return res.status(404).json({ message: "Client not found" });
        }

        await TrainerDB.findByIdAndUpdate(trainerId, { $pull: { clients: userId } });

        res.json({ message: "Client removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove client", error: error.message });
    }
};

exports.myReviews = async (req, res) => {
    try {
        const trainerId = req.trainer.id;  
        const trainer = await TrainerDB.findById(trainerId)
            .populate({
                path: "reviews",  
                populate: {
                    path: "userId", 
                    select: "username email" 
                }
            });

        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.json({
            averageRating: trainer.averageRating,
            totalReviews: trainer.reviews.length,
            reviews: trainer.reviews
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
    }
};

