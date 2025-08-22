const express = require("express")
const { protectRoute } = require("../Middleware/protectRoute")
const getUsersForSidebar = require("../Controller/user.controller")
const router = express.Router()

router.get("/", protectRoute, getUsersForSidebar) //http://127.0.0.1:5000/api/users

module.exports = router