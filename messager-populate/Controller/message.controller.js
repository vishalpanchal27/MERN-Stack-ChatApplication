const Conversation = require("../Models/conversation.model");
const Message = require("../Models/message.model");
const { io } = require("../socket/socket");
const Friend = require("../Models/friendList.Model");
const enrichFriendWithConversation = require("../Middleware/friendList.Middleware");


// const sendMessage = async (req, res) => {
//     try {
//         const { message } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         let conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] },
//         });

//         if (!conversation) {
//             conversation = await Conversation.create({
//                 participants: [senderId, receiverId],
//                 messages: [],
//             });
//         }

//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             message,
//         });

//         if (newMessage) {
//             conversation.messages.push(newMessage._id);
//         }

//         await Promise.all([conversation.save(), newMessage.save()]);

//         // Emit real-time message
//         io.to(receiverId.toString()).emit("newMessage", newMessage);

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("error in message controller", error.message);
//         res.status(500).json({ error: "internal server error" });
//     }
// };
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: [],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            time: new Date()
        });

        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // ✅ Emit the new message to receiver
        io.to(receiverId.toString()).emit("newMessage", newMessage);

        // ✅ Also update sidebar for both users
        const [senderFriends, receiverFriends] = await Promise.all([
            Friend.find({ ownerId: senderId }),
            Friend.find({ ownerId: receiverId })
        ]);

        const [enrichedSender, enrichedReceiver] = await Promise.all([
            Promise.all(senderFriends.map(f => enrichFriendWithConversation(f, senderId))),
            Promise.all(receiverFriends.map(f => enrichFriendWithConversation(f, receiverId)))
        ]);

        io.to(senderId.toString()).emit("friendListUpdated", enrichedSender);
        io.to(receiverId.toString()).emit("friendListUpdated", enrichedReceiver);

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("error in message getmessages controller", error.message);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = { sendMessage, getMessages };
