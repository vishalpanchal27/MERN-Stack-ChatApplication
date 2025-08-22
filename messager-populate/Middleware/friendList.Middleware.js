const Conversation = require("../Models/conversation.model");

const enrichFriendWithConversation = async (friend, ownerId) => {
    const conversation = await Conversation.findOne({
        participants: { $all: [ownerId, friend.user._id] }
    }).populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 }
    });

    const lastMessage = conversation?.messages[0];

    const friendObj = friend.toObject();

    friendObj.user = {
        ...friendObj.user,
        conversation: conversation ? {
            conversationId: conversation._id,
            lastMessage: lastMessage?.message || '',
            lastMessageTime: lastMessage?.createdAt || null
        } : null
    };

    friendObj.lastMessage = {
        message: lastMessage?.message || '',
        time: lastMessage?.createdAt || null,
        isRead: lastMessage?.isRead || false
    };

    return friendObj;
};

module.exports = enrichFriendWithConversation;
