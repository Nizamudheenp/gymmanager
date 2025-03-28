const TrainerDB = require("../models/trainermodel"); 
const UserDB =require('../models/usermodel')
const SessionDB = require('../models/sessionmodel')
const PaymentDB = require("../models/paymentmodel");


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

exports.getAllSessions = async (req, res) => {
    try {
      const sessions = await SessionDB.find().populate("trainerId", "username email");      
      res.status(200).json({ sessions });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({  message: "Server error" });
    }
  };

  exports.deleteSession = async (req, res) => {
    const { id } = req.params;
  
    try {
      const session = await SessionDB.findById(id);
      if (!session) return res.status(404).json({  message: "Session not found" });
  
      await SessionDB.findByIdAndDelete(id);
      res.status(200).json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.getSessionBookings = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await SessionDB.findById(id).populate("bookings.userId", "username email");

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json({ bookings: session.bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
};


exports.getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await UserDB.countDocuments();
    const totalTrainers = await TrainerDB.countDocuments({ verified: true });
    const totalSessions = await SessionDB.countDocuments();
    const upcomingSessions = await SessionDB.countDocuments({ status: "available" });
    const trainersReviews = await TrainerDB.find({}, "reviews");
    const totalFeedbacks = trainersReviews.reduce((sum, trainer) => sum + trainer.reviews.length, 0);
    const totalPayments = await PaymentDB.countDocuments({status : "completed"});
    const pendingActions = await TrainerDB.countDocuments({ verified: false });

    res.status(200).json({ 
            totalUsers,
            totalTrainers,
            totalSessions,
            upcomingSessions,
            totalFeedbacks,
            totalPayments,
            pendingActions,
    });
  } catch (error) {
    console.error("Error fetching admin overview:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFeedbacks = async (req, res) => {
    try {
        const trainers = await TrainerDB.find({}, "reviews").populate("reviews.userId", "username email");

        if (!trainers || trainers.length === 0) {
            return res.status(404).json({ message: "No feedbacks found" });
        }

        const feedbacks = trainers.flatMap(trainer =>
            trainer.reviews.map(review => ({
                _id: review._id, 
                trainerId: trainer._id,
                userId: review.userId?._id || null,
                username: review.userId?.username || "Unknown User",
                email: review.userId?.email || "No Email",
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt
            }))
        );

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteFeedbacks = async (req, res) => {
    const { reviewId } = req.params;


    try {
        const trainer = await TrainerDB.findOne({ "reviews._id": reviewId });
        if (!trainer) {
            return res.status(404).json({ message: "Review not found" });
        }

        trainer.reviews = trainer.reviews.filter(review => review._id.toString() !== reviewId);

        if (trainer.reviews.length > 0) {
            const totalRating = trainer.reviews.reduce((sum, review) => sum + review.rating, 0);
            trainer.averageRating = totalRating / trainer.reviews.length;
        } else {
            trainer.averageRating = 0; 
        }

        await trainer.save();

        res.status(200).json({ message: "Review deleted successfully", updatedTrainer: trainer });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        res.status(500).json({ message: "Server error" });
    }
};



