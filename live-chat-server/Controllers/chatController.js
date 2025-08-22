const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const asyncHandler = require("express-async-handler")

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if (!userId) {
        console.log("userId Params is not send with the requiest")
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate('users', '-password').populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email"
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }
    }

    try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id });
        res.status(200).json({
            success: true,
            result: FullChat
        })
    } catch (err) {
        res.status(400);
        throw new Error(error.message)
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("grounpAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name email"
                });
                res.status(200).send(results)
            })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
})

const fetchGroups = asyncHandler(async (req, res) => {
    try {
        const allGroups = await Chat.where("isGroupChat").equals(true);
        res.status(200).send(allGroups)
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Data is insufficient" })
    }
    var users = Json.parser(req.body.users);
    console.log("chatController/createGroups:", req);
    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json({
            success: true,
            result: fullGroupChat
        })
    } catch (err) {
        res.status(400)
        throw new Error(err.message)
    }
})

const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body


    const removed = await Chat.findByIdAndUpdate({ chatId, userId })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
    if (!removed) {
        res.status(400);
        throw new Error("Chat Not Found")
    } else {
        res.json(remove)
    }
})

const addSelfToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId }
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(400)
        throw new Error("chat not found")
    } else {
        res.json(added)
    }
})


module.exports = { groupExit, createGroupChat, accessChat, fetchChats, fetchGroups, addSelfToGroup }