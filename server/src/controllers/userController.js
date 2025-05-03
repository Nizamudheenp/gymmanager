const AppointmentDB = require('../models/appointmentmodel')
const WorkoutDB = require('../models/workoutmodel')
const getNutrition = require('../utilities/nutritionfetch')
const NutritionDB = require('../models/nutritionmodel')
const TrainerDB = require("../models/trainermodel");
const SessionDB = require('../models/sessionmodel')
const UserDB = require('../models/usermodel')

const moment = require("moment");


exports.availableTrainers = async (req, res) => {
    try {
        const trainers = await TrainerDB.find({ verified: true }).select("-password");
        if (!trainers) {
            return res.status(404).json({ message: "No Trainers Available" })
        }
        res.status(200).json({ trainers })
    } catch (error) {
        res.status(500).json({ message: "trainers fetching failed", error: error.message });
    }
}
exports.cleanup = async (req, res) => {
    try {
      await AppointmentDB.deleteMany({ status: { $in: ["pending", "cancelled"] } });
  
      res.json({ message: "Pending and canceled appointments deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting appointments", error });
    }
  };
exports.bookTraining = async (req, res) => {
    try {
        const { trainerId } = req.body
        const userId = req.user.id
        const existingAppointment = await AppointmentDB.findOne({
            userId,
            trainerId
        });

        if (existingAppointment) {
            return res.status(400).json({ message: "You have already booked this trainer." });
        }
        const newAppointment = await AppointmentDB.create({
            userId,
            trainerId,
            status: "pending"
        })
        await TrainerDB.findByIdAndUpdate(trainerId, {
            $addToSet: { clients: userId }
        });

        res.status(201).json({ message: "session booked", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });

    }
}
exports.getAllBookings = async (req, res) => {
    try {
        const appointments = await AppointmentDB.find({ userId: req.user.id })
            .populate("trainerId", "username email")
            .lean();

        if (!appointments.length) {
            return res.status(404).json({ message: "No bookings found for this user." });
        }

        res.json({ appointments });
    } catch (error) {
        res.status(500).json({ message: "Failed to get user appointments", error: error.message });
    }
};


exports.getworkouts = async (req, res) => {
    try {
        const workouts = await WorkoutDB.find({ userId: req.user.id }).populate("trainerId", "username email")
        if (workouts.length === 0) {
            return res.status(404).json({ message: "No workouts assigned" });
        }
        res.json({ workouts })
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch workouts", error: error.message });

    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (!status) {
            return res.status(400).json({ message: "status is required" })
        }
        const workout = await WorkoutDB.findById(req.params.id)
        if (!workout) {
            return res.status(404).json({ message: "workout not found" })
        }
        if (workout.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }
        workout.status = status
        await workout.save()
        res.json({ message: `Workout marked as ${status}`, workout });

    } catch (error) {
        res.status(500).json({ message: "Failed to update workout", error: error.message });

    }
}

exports.logMeal = async (req, res) => {
    try {
        const { foodName, portionSize } = req.body;
        if (!foodName && !portionSize) {
            return res.status(400).json({ message: "foodname and portion size are required" })
        }
        const nutritionData = await getNutrition(foodName, portionSize)
        if (!nutritionData) {
            return res.status(404).json({ message: "No food data found. Please check the meal name." });
        }
        let nutritionLog = await NutritionDB.findOne({ userId: req.user.id });
        if (!nutritionLog) {
            nutritionLog = new NutritionDB({ userId: req.user.id, meals: [] });
        }

        const today = moment().startOf("day");
        const mealsToday = nutritionLog.meals.filter(meal =>
            moment(meal.createdAt).isSameOrAfter(today)
        );

        if (mealsToday.length >= 3) {
            return res.status(403).json({ message: "You can only log 3 meals per day." });
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
        res.status(201).json({ message: "Meal logged successfully", nutrition: nutritionLog });

    } catch (error) {
        res.status(500).json({ message: "Failed to log meal", error: error.message });

    }
}

exports.nutritionhistory = async (req, res) => {
    try {
        const nutrition = await NutritionDB.find({ userId: req.user.id })
        res.json({ nutrition })
    } catch (error) {
        res.status(500).json({ message: "Failed to get history", error: error.message })
    }
}

exports.deleteMeal = async (req, res) => {
    try {
        const { mealId } = req.params;
        const userId = req.user.id; 

        const updatedNutrition = await NutritionDB.findOneAndUpdate(
            { userId },
            { $pull: { meals: { _id: mealId } } },
            { new: true }
        );

        if (!updatedNutrition) {
            return res.status(404).json({ message: "Meal not found or already deleted" });
        }

        res.json({ message: "Meal deleted successfully", updatedMeals: updatedNutrition.meals });
    } catch (error) {
        console.error("Error deleting meal:", error);
        res.status(500).json({ error: "Failed to delete meal" });
    }
};


exports.getAvailableSessions = async (req, res) => {
    try {
        const currentDate = new Date();
        
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - 1); 

        const sessions = await SessionDB.find({ 
            status: "available", 
            date: { $gte: pastDate }
        })
        .populate("trainerId", "username email");

        if (!sessions.length) {
            return res.status(404).json({ message: "No available sessions found" });
        }

        res.json({ sessions });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
    }
};


exports.bookSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        const session = await SessionDB.findById(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        const existingBooking = session.bookings.find(b => b.userId.toString() === userId);
        if (existingBooking) {
            return res.status(400).json({ message: "You have already requested this session" });
        }

        session.bookings.push({ userId, status: "pending" });
        await session.save();

        res.status(200).json({ message: "Session request sent. Waiting for trainer approval." });
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
};

exports.getsessiondetails = async (req, res) => {
    try {
        const sessionDetails = await SessionDB.findById(req.params.sessionId)
            .populate("trainerId", "username")
            .populate("workouts");
        if (!sessionDetails) {
            return res.status(404).json({ message: "Session not found" });
        }

        const userBooking = sessionDetails.bookings.find(
            (booking) => booking.userId.toString() === req.user.id && booking.status === "approved"
        );

        if (!userBooking) {
            return res.status(403).json({ message: "You are not approved for this session" });
        }

        res.json(sessionDetails);
    } catch (error) {
        console.error("Error fetching session details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.addReview = async (req, res) => {
    try {
        const { trainerId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        const sessionAttended = await SessionDB.findOne({
            trainerId,
            "bookings.userId": userId,
            "bookings.status": "approved", 
                });

        if (!sessionAttended) {
            return res.status(403).json({ message: "You can only review trainers after attending an approved session." });
        }

        const trainer = await TrainerDB.findById(trainerId);
        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found." });
        }

        const existingReview = trainer.reviews.find(review => review.userId.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this trainer." });
        }

        trainer.reviews.push({ userId, rating, comment });

        const totalRatings = trainer.reviews.length;
        const averageRating = trainer.reviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
        trainer.averageRating = averageRating.toFixed(1);

        await trainer.save();
        res.status(201).json({ message: "Review added successfully", trainer });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
};


exports.getTrainerReviews = async (req, res) => {
    try {
        const { trainerId } = req.params;
        const trainer = await TrainerDB.findById(trainerId).populate("reviews.userId", "name email")

        if (!trainer) {
            return res.status(404).json({ message: "Trainer not found" })
        }

        res.json({
            averageRating: trainer.averageRating,
            totalReviews: trainer.reviews.length,
            reviews: trainer.reviews
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch reviews", error: error.message })

    }
}

exports.logProgress = async (req, res) => {
    try {
        const { weight, bodyFat } = req.body;
        const userId = req.user.id;

        const user = await UserDB.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const height = user.fitnessData.height;
        if (!height) {
            return res.status(400).json({ message: "Please set your height in profile before logging progress." });
        }

        const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);

        const muscleMass = ((weight * (100 - bodyFat)) / 100).toFixed(2);

        user.progress.push({ weight, bodyFat, bmi, muscleMass });
        await user.save();

        res.status(201).json({
            message: "Progress logged successfully",
            progress: user.progress
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to log progress", error: error.message });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserDB.findById(userId).select("progress");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ progress: user.progress });

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve progress", error: error.message });
    }
};

exports.deleteProgress = async (req, res) => {
    try {
        const user = await UserDB.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.progress = user.progress.filter((entry) => entry._id.toString() !== req.params.progressId);

        await user.save();
        res.json({ message: "Progress deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete progress" });
    }
}
