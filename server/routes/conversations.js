const router = require("express").Router();
const Conversation = require("../models/Conversation");

// 1. New Conversation (When you click "Chat with Seller")
router.post("/", async (req, res) => {
  // Check if conversation already exists
  const existingConversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
  });

  if (existingConversation) return res.status(200).json(existingConversation);

  // If not, create new one
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. Get Conversations of a User (Load Inbox)
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. Get Conversation includes two userId (Find specific chat)
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;