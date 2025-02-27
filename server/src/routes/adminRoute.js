const express = require('express')
const router = express.Router()
const {adminAuth} = require('../middleware/auth')
const { trainerApproval } = require('../controllers/adminController')

router.put('/approvetrainer/:id',adminAuth,trainerApproval)

module.exports = router
