const express = require('express')
const { userAuth } = require('../middleware/auth')
const { getAllBookings, getworkouts, updateStatus, logMeal, availableTrainers,
        bookTraining, getAvailableSessions, bookSession, addReview, getTrainerReviews,
        logProgress, getProgress, 
        nutritionhistory,
        deleteProgress,
        getsessiondetails} = require('../controllers/userController')
const { setFitnessGoal, updateCurrentProgress, getUserGoals } = require('../controllers/fitnessController')
const router = express.Router()

router.get('/availabletrainers',userAuth,availableTrainers) //done
router.post('/booktrainer',userAuth,bookTraining) //done
router.get('/getbookings',userAuth,getAllBookings) //done
router.get('/getworkouts',userAuth,getworkouts) //done
router.put('/updatestatus/:id',userAuth,updateStatus) //done
router.post('/logmeal',userAuth, logMeal) //done
router.get('/nutritionhistory',userAuth, nutritionhistory) //done
router.post('/setgoal',userAuth,setFitnessGoal) //done
router.put('/updategoal/:id',userAuth,updateCurrentProgress)  //done
router.get('/getgoals',userAuth,getUserGoals)  //done
router.get('/getsessions',userAuth,getAvailableSessions) //done
router.post('/booksession',userAuth,bookSession) //done
router.get('/getsessiondetails/:sessionId',userAuth,getsessiondetails) //done
router.post('/review/:trainerId',userAuth,addReview)
router.get('/getreviews/:trainerId',getTrainerReviews)
router.post('/logprogress' ,userAuth,logProgress)//done
router.get('/getprogress',userAuth,getProgress)//done
router.delete("/deleteprogress/:progressId" ,userAuth,deleteProgress)//done


module.exports = router