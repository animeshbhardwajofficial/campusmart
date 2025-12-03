const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, phoneNumber, regNo, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { regNo }] });
        if (userExists) return res.status(400).json({ message: "User with this Email or RegNo already exists" });

        // 2. Hash the password (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new user
        const newUser = new User({
            username,
            email,
            phoneNumber,
            regNo,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully", userId: savedUser._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        // User can login with Email OR RegNo
        const { identifier, password } = req.body; 

        // 1. Find user
        const user = await User.findOne({ 
            $or: [{ email: identifier }, { regNo: identifier }] 
        });
        
        if (!user) return res.status(400).json({ message: "User not found" });

        // 2. Check Password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: "Invalid password" });

        // 3. Create & Assign Token (This is their "Digital ID Card")
        const token = jwt.sign({ _id: user._id }, 'SUPERSECRETKEY123', { expiresIn: '7d' });
        
        // Remove password from response for security
        const { password: _, ...userInfo } = user._doc;

        res.header('auth-token', token).json({ token, user: userInfo });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;