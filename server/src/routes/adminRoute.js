const express = require('express')
const router = express.Router()
const {adminAuth} = require('../middleware/auth')
const { trainerApproval, getAllUsers, getAllTrainers, deleteUser, deleteTrainer, getAllUserProgress, getAllSessions, deleteSession, getSessionBookings, getAdminOverview, deleteFeedbacks, getFeedbacks } = require('../controllers/adminController')

router.put('/approvetrainer/:id',adminAuth,trainerApproval)
router.get('/getusers',adminAuth,getAllUsers)
router.get('/gettrainers',adminAuth,getAllTrainers)
router.delete("/deleteuser/:id", adminAuth, deleteUser)
router.delete("/deletetrainer/:id", adminAuth, deleteTrainer)
router.get("/user-progress", adminAuth, getAllUserProgress);
router.get("/allsessions",adminAuth,getAllSessions)
router.delete("/deletesession/:id",adminAuth,deleteSession)
router.get("/sessionbookings/:id", adminAuth, getSessionBookings);
router.get("/overview",adminAuth,getAdminOverview)
router.get("/getfeedbacks",adminAuth,getFeedbacks)
router.delete("/delete-feedback/:reviewId", adminAuth, deleteFeedbacks);




module.exports = router
