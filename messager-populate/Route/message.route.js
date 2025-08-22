const express = require("express")
const { sendMessage, getMessages } = require("../Controller/message.controller")
const { protectRoute } = require("../Middleware/protectRoute")
const router = express.Router()

router.get("/:id", protectRoute, getMessages); //http://127.0.0.1:8000/api/message/:id
router.post("/send/:id", protectRoute, sendMessage) //http://127.0.0.1:8000/api/message/send/:id

module.exports = router