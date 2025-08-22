const Friend = require("../Models/friendList.Model");
const Conversation = require("../Models/conversation.model")
const Message = require("../Models/message.model")
const enrichFriendWithConversation = require("../Middleware/friendList.Middleware");

const addFriend = async (req, res) => {
    try {
        const { user, message, ownerId } = req.body;

        if (
            !user || typeof user !== 'object' || Object.keys(user).length === 0 ||
            !ownerId || typeof ownerId !== 'string' || ownerId.trim() === ""
        ) {
            console.log(user, message, ownerId)
            console.log("Validation failed: missing user or ownerId");
            return res.status(400).json({ message: "user and ownerId must be valid, non-empty values" });
        }

        const isExist = await Friend.findOne({ "user._id": user._id });
        if (!isExist) {
            const newFriend = new Friend({ user, message, ownerId });
            //console.log(`New friend added: ${JSON.stringify(newFriend)}`);
            await newFriend.save();
            res.status(201).json(newFriend);
        } else {
            res.status(400).json({ error: "Friend already exists" });
        }
    } catch (error) {
        console.log("Error in addFriend controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getFriend = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const friends = await Friend.find({ ownerId });

        const enrichedFriends = await Promise.all(
            friends.map(friend => enrichFriendWithConversation(friend, ownerId))
        );
        req.io.to(ownerId.toString()).emit("friendListUpdated", enrichedFriends);
        res.status(200).json(enrichedFriends);
    } catch (error) {
        console.log("Error in getFriend:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addFriend, getFriend };
