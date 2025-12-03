const router = require("express").Router();
const User = require("../models/User");

// 1. Get User Details
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId 
      ? await User.findById(userId) 
      : await User.findOne({ username: username });
      
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// --- NEW ROUTES ---

// 2. Toggle Wishlist Item (Add if new, Remove if exists)
router.put("/:userId/wishlist", async (req, res) => {
    const { itemId } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        
        if (user.wishlist.includes(itemId)) {
            // Item exists? Remove it ($pull)
            await user.updateOne({ $pull: { wishlist: itemId } });
            res.status(200).json("Removed");
        } else {
            // Item doesn't exist? Add it ($push)
            await user.updateOne({ $push: { wishlist: itemId } });
            res.status(200).json("Added");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. Get User's Wishlist Items (Populated with full Item details)
router.get("/:userId/wishlist", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('wishlist');
        res.status(200).json(user.wishlist);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;