const express = require('express')
const { userAuth } = require('../middleware/auth')
const { getAllBookings, getworkouts, updateStatus, logMeal, availableTrainers,
        bookTraining, getAvailableSessions, bookSession, addReview, getTrainerReviews,
        logProgress, getProgress, 
        nutritionhistory,
        deleteProgress,
        getsessiondetails,
        cleanup,
        deleteMeal} = require('../controllers/userController')
const { setFitnessGoal, updateCurrentProgress, getUserGoals, deleteGoals } = require('../controllers/fitnessController')
const router = express.Router()

router.get('/availabletrainers',userAuth,availableTrainers) 
router.delete("/cleanup",userAuth,cleanup)
router.post('/booktrainer',userAuth,bookTraining) 
router.get('/getbookings',userAuth,getAllBookings) 
router.get('/getworkouts',userAuth,getworkouts) 
router.put('/updatestatus/:id',userAuth,updateStatus) 
router.post('/logmeal',userAuth, logMeal) 
router.delete("/deletemeal/:mealId",userAuth,deleteMeal)
router.get('/nutritionhistory',userAuth, nutritionhistory) 
router.post('/setgoal',userAuth,setFitnessGoal) 
router.delete("/deletegoal/:goalId",userAuth,deleteGoals)
router.put('/updategoal/:id',userAuth,updateCurrentProgress)  
router.get('/getgoals',userAuth,getUserGoals)  
router.get('/getsessions',userAuth,getAvailableSessions) 
router.post('/booksession',userAuth,bookSession) 
router.get('/getsessiondetails/:sessionId',userAuth,getsessiondetails) 
router.post('/review/:trainerId',userAuth,addReview)
router.get('/getreviews/:trainerId',getTrainerReviews)
router.post('/logprogress' ,userAuth,logProgress)
router.get('/getprogress',userAuth,getProgress)
router.delete("/deleteprogress/:progressId" ,userAuth,deleteProgress)


module.exports = router