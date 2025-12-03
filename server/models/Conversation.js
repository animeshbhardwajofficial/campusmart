const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array, // Stores [SellerID, BuyerID]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);