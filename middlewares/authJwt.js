// backend/middlewares/authJwt.js
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const authJwt = () => {
    return async (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next();
        } else {
            const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers
            if (!token) {
                return res.status(403).send('Access denied.');
            }

            try {
                const decoded = jwt.verify(token, process.env.secret); // Verify token
                req.user = decoded; // Attach user info to request
                next(); // Proceed to the next middleware
            } catch (error) {
                return res.status(401).send('Invalid token.');
            }
        }
    };
};

module.exports = authJwt;
