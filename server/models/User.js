const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    regNo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profilePic: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    
    // --- NEW PROFILE FIELDS ---
    department: { type: String, default: "" },
    bio: { type: String, default: "" },
    // --------------------------

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item' 
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);