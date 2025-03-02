const express = require('express')
const router = express.Router()
const {adminAuth} = require('../middleware/auth')
const { trainerApproval, getAllUsers, getAllTrainers, deleteUser, deleteTrainer, getAllUserProgress } = require('../controllers/adminController')

router.put('/approvetrainer/:id',adminAuth,trainerApproval)
router.get('/getusers',adminAuth,getAllUsers)
router.get('/gettrainers',adminAuth,getAllTrainers)
router.delete("/deleteuser/:id", adminAuth, deleteUser)
router.delete("/deletetrainer/:id", adminAuth, deleteTrainer)
router.get("/user-progress", adminAuth, getAllUserProgress);


module.exports = router
