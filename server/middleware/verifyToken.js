// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-please-change';

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // { _id: ... }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};
