import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Creates a new conversation or finds an existing one
export const createOrGetConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { recipientId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: "Start a conversation!",
          sender: senderId,
        },
      });
      await conversation.save();
    }

    res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error("Error in createOrGetConversation: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Gets all conversations for the logged-in user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId }).populate({
      path: "participants",
      select: "fullName profilePicture",
    });

    // Remove the current user from participants list for frontend ease of use
    conversations.forEach((conv) => {
      conv.participants = conv.participants.filter((p) => p._id.toString() !== userId.toString());
    });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Error in getConversations: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Gets all messages for a specific conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }); // Fetch oldest first
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markConversationAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await Conversation.updateOne({ _id: conversationId }, { $addToSet: { "lastMessage.seenBy": userId } });

    res.status(200).json({ success: true, message: "Conversation marked as seen" });
  } catch (error) {
    console.error("Error in markConversationAsSeen: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
