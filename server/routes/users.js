const router = require("express").Router();
const User = require("../models/User");

// --- Import necessary dependencies for file handling and security ---
const verify = require("../middleware/verifyToken");
const { upload } = require("../config/cloudinary");
// -------------------------------------------------------------------

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

// 2. Toggle Wishlist
router.put("/:userId/wishlist", async (req, res) => {
  const { itemId } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (user.wishlist.includes(itemId)) {
      await user.updateOne({ $pull: { wishlist: itemId } });
      res.status(200).json("Removed");
    } else {
      await user.updateOne({ $push: { wishlist: itemId } });
      res.status(200).json("Added");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. Get Wishlist
router.get("/:userId/wishlist", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. UPDATE PROFILE (Fields)
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const { password, ...updatedUser } = user._doc;
    res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 5. UPDATE PROFILE PICTURE (NEW API ROUTE FOR FILE UPLOAD)
router.put(
  "/:id/picture",
  verify,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // Security Check: Ensure the user token matches the profile being updated
    if (req.user._id !== req.params.id) {
      return res.status(403).json("Unauthorized access.");
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { profilePic: req.file.path },
        },
        { new: true }
      );

      // Return updated user data (without password)
      const { password, ...userData } = updatedUser._doc;
      res.status(200).json(userData);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

module.exports = router;
