const express = require('express')
const {userRegister, trainerRegister, userLogin, trainerLogin, adminLogin, adminRegister} = require('../controllers/authController')
const router = express.Router()



router.post('/userRegister',userRegister)
router.post('/userLogin',userLogin,)
router.post('/trainerRegister',trainerRegister)
router.post('/trainerLogin',trainerLogin,)
router.post('/adminRegister',adminRegister)
router.post('/adminLogin',adminLogin,)



module.exports = router