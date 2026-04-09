const express = require('express');
const apiRouter = express.Router();

// Controllers
const authController = require('../controllers/auth-controller');
const appointmentController = require('../controllers/appointment-controller');
const recommendationController = require('../controllers/recommendation-controller');
const reportController = require('../controllers/report-controller');

// Middleware
const authMiddleware = require('../middleware/auth-middleware');

/**
 * Authentication and User Management Routes
 */
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);

/**
 * AI-powered Patient Report Analysis
 */
apiRouter.post('/analyze-report', authMiddleware, reportController.analyze);

/**
 * Doctor Recommendation and Search
 */
apiRouter.get('/doctors/recommendations', recommendationController.recommend);
apiRouter.get('/doctors/recommendations/symptom', recommendationController.recommendBySymptom);

/**
 * Appointment Management Protected Routes
 */
apiRouter.post('/appointments/book', authMiddleware, appointmentController.book);
apiRouter.post('/appointments/cancel/:id', authMiddleware, appointmentController.cancel);
apiRouter.post('/appointments/complete/:id', authMiddleware, appointmentController.complete);

module.exports = apiRouter;
