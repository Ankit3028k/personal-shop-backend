// backend/middlewares/admin.js
const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];  // Assuming Bearer token format
    if (!token) {
        return res.status(403).json({ message: 'Authorization required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = isAdmin;
