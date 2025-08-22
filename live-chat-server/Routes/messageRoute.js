const express = require("express")
const router = express.Router()

const { allMessages, sendMessage } = require("../Controllers/messageController.js")

const { protect } = require("../middlewares/userAuth-middleware")

router.get("/:chatId", protect, allMessages)
router.post('/'.protect, sendMessage)

module.exports = router