// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token se split karein

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized, token invalid');
        }
        req.user = decoded; // Token se user information ko request me attach karein
        next(); // Middleware chain me aage badhein
    });
};

module.exports = verifyToken;
