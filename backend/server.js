require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./src/config/database-config');
const apiRouter = require('./src/routes/api-router');

/**
 * DocNex Backend Server
 * Architecture: Service-Controller-Router with Mongoose.
 */
const app = express();

// Database Connectivity
connectDatabase();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Main API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((error, req, res, next) => {
    console.error('Server Fault:', error.stack);
    res.status(500).json({ 
        error: 'A server fault occurred while processing your request.', 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
});

const APP_PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(APP_PORT, () => {
        console.log(`[SERVER] Online on port ${APP_PORT}`);
    });
}

module.exports = app;
