const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user: {
        _id: mongoose.Schema.Types.ObjectId,
        fullName: String,
        userName: String,
        profilePicture: String
    },
    lastMessage: {
        message: String,
        time: {
            type: Date,
            default: Date.now
        },
        isRead: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Friend", friendSchema);
