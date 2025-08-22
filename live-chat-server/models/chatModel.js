const mongoose = require('mongoose')
const chatSchema = mongoose.Schema({
    chatName: { type: String },
    isGroupChat: { type: Boolean },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
})
const chatModel = mongoose.model('Chat', chatSchema)
module.exports = chatModel