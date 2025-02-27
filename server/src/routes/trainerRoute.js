const express = require('express')
const { trainerAuth } = require('../middleware/auth')
const { getAllBookings, updateBooking, assignWorkouts, deleteWorkout } = require('../controllers/trainerControllers')
const router = express.Router()

router.put('/managebooking/:id',trainerAuth,updateBooking)
router.get('/getbookings',trainerAuth,getAllBookings)
router.post('/assignworkouts',trainerAuth,assignWorkouts)
router.delete('/deleteworkouts/:id',trainerAuth,deleteWorkout)


module.exports = router