const express = require('express')
const { trainerAuth } = require('../middleware/auth')
const { getAllBookings, updateBooking, assignWorkouts, deleteWorkout, viewUserNutrition, 
    createSession, getClientProgress, removeClient, getUserWorkouts, addWorkoutToSession, 
    approveSessionRequest,
    getTrainerSessions} = require('../controllers/trainerControllers')
const upload = require('../middleware/multer')
const router = express.Router()

router.put('/managebooking/:appointmentId',trainerAuth,updateBooking) //done
router.get('/getbookings',trainerAuth,getAllBookings) //done
router.post('/assignworkouts',trainerAuth,assignWorkouts) //done
router.get('/getuserworkouts/:userId',trainerAuth,getUserWorkouts)  //done
router.delete('/removeclient/:userId',trainerAuth,removeClient) //done
router.delete('/deleteworkout/:exerciseId',trainerAuth, deleteWorkout) //done
router.get('/usernutrition/:userId',trainerAuth,viewUserNutrition) //done
router.post('/createsession',trainerAuth,upload.single('image'),createSession) //done
router.get("/mysessions", trainerAuth, getTrainerSessions);//done
router.post('/addWorkoutToSession',trainerAuth,addWorkoutToSession) //done
router.post('/approveSessionRequest',trainerAuth,approveSessionRequest) //done
router.get('/getclientprogress/:userId',trainerAuth,getClientProgress)


module.exports = router