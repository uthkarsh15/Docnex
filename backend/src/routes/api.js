const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const AppointmentController = require('../controllers/AppointmentController');
const RecommendationController = require('../controllers/RecommendationController');
const auth = require('../middleware/auth');

// Auth Routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Recommendation Routes
router.get('/doctors/recommendations', RecommendationController.recommend);
router.get('/doctors/recommendations/symptom', RecommendationController.recommendBySymptom);

// Appointment Routes
router.post('/appointments/book', auth, AppointmentController.book);
router.post('/appointments/cancel/:id', auth, AppointmentController.cancel);
router.post('/appointments/complete/:id', auth, AppointmentController.complete);

module.exports = router;
