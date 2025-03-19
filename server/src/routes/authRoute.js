const express = require('express')
const {userRegister, trainerRegister, adminRegister, login} = require('../controllers/authController')
const router = express.Router()
const upload = require("../middleware/multer");

router.post('/userRegister',userRegister)
router.post('/trainerRegister',upload.single("certifications"), trainerRegister)
router.post('/adminRegister',adminRegister)
router.post('/login',login)



module.exports = router