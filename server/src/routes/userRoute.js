const express = require('express')
const { userAuth } = require('../middleware/auth')
const {  getAllBookings, getworkouts, updateStatus, logMeal, availableTrainers, bookTraining, getAvailableSessions, bookSession } = require('../controllers/userController')
const { setFitnessGoal, updateCurrentProgress, getUserGoals } = require('../controllers/fitnessController')
const router = express.Router()

router.get('/availabletrainers',userAuth,availableTrainers)
router.post('/booktraining',userAuth,bookTraining)
router.get('/getbookings',userAuth,getAllBookings)
router.get('/getworkouts',userAuth,getworkouts)
router.put('/updatestatus/:id',userAuth,updateStatus)
router.post('/logmeal',userAuth, logMeal)
router.post('/setgoal',userAuth,setFitnessGoal)
router.put('/updategoal/:id',userAuth,updateCurrentProgress)
router.get('/getprogress',userAuth,getUserGoals)
router.get('/getsessions',userAuth,getAvailableSessions)
router.post('/booksession',userAuth,bookSession)


module.exports = router