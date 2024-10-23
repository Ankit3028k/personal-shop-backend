// errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;

// In your main server file (e.g., app.js or server.js)
const errorHandler = require('./errorHandler');
// ... other middleware and routes
app.use(errorHandler);