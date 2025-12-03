const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links the item to the User who posted it
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: ['Books', 'Electronics', 'Furniture', 'Clothing', 'Other'],
        required: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Used', 'Damaged'],
        required: true,
    },
    images: [
        {
            type: String, // Cloudinary URLs will be stored here
        }
    ],
    isSold: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);