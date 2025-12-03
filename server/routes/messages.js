const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// 1. Add Message
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Get Messages (Load Chat History)
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- NEW FEATURES ---

// 3. Get Unread Conversations for a User
router.get("/unread/:userId", async (req, res) => {
  try {
    // A. Find all conversations this user is part of
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    
    // Extract IDs
    const conversationIds = conversations.map(c => c._id.toString());

    // B. Find messages in these chats that are NOT from me, and are unread
    const unreadMessages = await Message.find({
        conversationId: { $in: conversationIds },
        sender: { $ne: req.params.userId }, // Not sent by me
        read: false
    });

    // C. Return distinct Conversation IDs that have unread messages
    const unreadConversationIds = [...new Set(unreadMessages.map(m => m.conversationId))];
    
    res.status(200).json(unreadConversationIds);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. Mark Messages as Read (When opening a chat)
router.put("/read/:conversationId", async (req, res) => {
    try {
        // Update all messages in this chat (that are not mine) to read: true
        // We pass the 'readerId' in body to ensure we don't mark our own messages as read (logic safety)
        await Message.updateMany(
            { 
                conversationId: req.params.conversationId,
                sender: { $ne: req.body.readerId } 
            },
            { $set: { read: true } }
        );
        res.status(200).json("Messages marked as read");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;