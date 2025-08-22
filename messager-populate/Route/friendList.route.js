const express = require("express")
const {addFriend, getFriend} = require("../Controller/friendList.controller")
const router = express.Router()

router.get("/getFriendList/:id", getFriend);
//http://localhost:8000/api/friends/getFriendList
router.post("/postSaveFriend", addFriend) 
//http://localhost:8000/api/friends/postSaveFriend


module.exports = router