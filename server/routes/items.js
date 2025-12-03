const router = require('express').Router();
const Item = require('../models/Item');
const { upload } = require('../config/cloudinary');
const verify = require('./verifyToken'); // <--- IMPORT THIS

// GET ALL ITEMS (Public - No login needed)
router.get('/', async (req, res) => {
    const { category, search } = req.query;
    let query = { isSold: false };

    if (category) query.category = category;
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    try {
        const items = await Item.find(query)
            .populate('seller', 'username regNo profilePic')
            .sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST A NEW ITEM (Protected - Login Required)
// Added 'verify' middleware here vvv
router.post('/', verify, upload.array('images', 4), async (req, res) => {
    try {
        const imageUrls = req.files.map(file => file.path); 

        const newItem = new Item({
            seller: req.user._id, // <--- NOW WE GET ID FROM THE TOKEN
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            condition: req.body.condition,
            images: imageUrls 
        });

        const savedItem = await newItem.save();
        res.status(200).json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// DELETE ITEM (Only the Seller can delete)
router.delete('/:id', verify, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json("Item not found");

        // Security Check: Is the person requesting the delete the same as the seller?
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