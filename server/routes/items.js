const router = require("express").Router();
const Item = require("../models/Item");
const { upload } = require("../config/cloudinary");
const verify = require("../middleware/verifyToken");

// GET ALL ITEMS (With Search, Category, and Department Filter)
router.get("/", async (req, res) => {
  // 1. Destructure the new 'department' query parameter
  const { category, search, department } = req.query;

  let baseQuery = { isSold: false };
  let departmentQuery = {}; // Query object used to filter the linked User model

  if (category) baseQuery.category = category;
  if (search) {
    baseQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 2. LOGIC: Prepare Department Filter
  if (department && department !== "All") {
    // If a department is specified, create a match query for the seller field
    departmentQuery = { department: department };
  }

  try {
    // 3. Execute Query with Populated Filtering
    const items = await Item.find(baseQuery)
      .populate({
        path: "seller",
        // Apply the department filter to the linked User model
        match: departmentQuery,
        select: "username regNo profilePic department", // Ensure the department field is returned
      })
      .sort({ createdAt: -1 })
      .exec();

    // 4. Final Filtering: Remove items whose sellers did not match the department filter
    // (Mongoose sets the 'seller' field to null if the match fails)
    const finalItems = items.filter((item) => item.seller !== null);

    res.status(200).json(finalItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST A NEW ITEM (Protected - Login Required)
router.post("/", verify, upload.array("images", 4), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);

    const newItem = new Item({
      seller: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      condition: req.body.condition,
      images: imageUrls,
    });

    const savedItem = await newItem.save();
    res.status(200).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE ITEM (Only the Seller can delete)
router.delete("/:id", verify, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json("Item not found");

    if (item.seller.toString() !== req.user._id) {
      return res.status(401).json("You are not allowed to delete this item");
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json("Item has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
