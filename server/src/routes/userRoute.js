const express = require('express')
const { userAuth } = require('../middleware/auth')
const { bookSession, getAllBookings, getworkouts, updateStatus, logMeal } = require('../controllers/userController')
const router = express.Router()

router.post('/booksession',userAuth,bookSession)
router.get('/getbookings',userAuth,getAllBookings)
router.get('/getworkouts',userAuth,getworkouts)
router.put('/updatestatus/:id',userAuth,updateStatus)
router.post('/logmeal',userAuth, logMeal)


module.exports = router