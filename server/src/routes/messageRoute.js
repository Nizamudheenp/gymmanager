const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { userORtrainerAuth } = require('../middleware/auth');
const router = express.Router()

router.post("/send", userORtrainerAuth ,sendMessage)
router.get("/:receiverId",userORtrainerAuth,getMessages)


module.exports = router