const express = require('express')
const { trainerAuth } = require('../middleware/auth')
const { getAllBookings, updateBooking, assignWorkouts, deleteWorkout, viewUserNutrition, 
    createSession, getClientProgress, removeClient, getUserWorkouts, addWorkoutToSession, 
    approveSessionRequest,
    getTrainerSessions,
    myReviews,
    deleteWorkoutFromSession,
    deleteSession} = require('../controllers/trainerControllers')
const upload = require('../middleware/multer')
const router = express.Router()

router.put('/managebooking/:appointmentId',trainerAuth,updateBooking) 
router.get('/getbookings',trainerAuth,getAllBookings) 
router.post('/assignworkouts',trainerAuth,assignWorkouts) 
router.get('/getuserworkouts/:userId',trainerAuth,getUserWorkouts)  
router.delete('/removeclient/:userId',trainerAuth,removeClient)
router.delete('/deleteworkout/:exerciseId',trainerAuth, deleteWorkout) 
router.get('/usernutrition/:userId',trainerAuth,viewUserNutrition) 
router.post('/createsession',trainerAuth,upload.single('image'),createSession) 
router.get("/mysessions", trainerAuth, getTrainerSessions);
router.post('/addWorkoutToSession',trainerAuth,addWorkoutToSession) 
router.post('/approveSessionRequest',trainerAuth,approveSessionRequest) 
router.post("/deleteWorkoutFromSession", trainerAuth, deleteWorkoutFromSession);
router.delete("/deleteSession/:sessionId", trainerAuth, deleteSession);
router.get('/getclientprogress/:userId',trainerAuth,getClientProgress)
router.get("/myreviews",trainerAuth,myReviews)


module.exports = router