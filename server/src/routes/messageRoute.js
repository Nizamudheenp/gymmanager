const express = require('express');
const { sendMessage, getMessages, getContacts } = require('../controllers/messageController');
const { userORtrainerAuth } = require('../middleware/auth');
const router = express.Router()

router.get("/contacts", userORtrainerAuth, getContacts);
router.get("/:receiverId",userORtrainerAuth,getMessages)
router.post("/send", userORtrainerAuth ,sendMessage)





module.exports = router