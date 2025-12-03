const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        // We verify the token using the SAME secret key we used in auth.js
        const verified = jwt.verify(token, 'SUPERSECRETKEY123');
        req.user = verified; // This adds the User ID to the request
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};