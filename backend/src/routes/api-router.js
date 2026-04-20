const express = require('express');
const apiRouter = express.Router();

// Controllers
const authController = require('../controllers/auth-controller');
const appointmentController = require('../controllers/appointment-controller');
const recommendationController = require('../controllers/recommendation-controller');
const Doctor = require('../models/Doctor');
const AppointmentSlot = require('../models/AppointmentSlot');


// Middleware
const authMiddleware = require('../middleware/auth-middleware');

/**
 * Authentication and User Management Routes
 */
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);


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
apiRouter.get('/appointments/incoming', authMiddleware, appointmentController.incoming);
apiRouter.get('/appointments/my', authMiddleware, appointmentController.my);
apiRouter.patch('/appointments/:id/respond', authMiddleware, appointmentController.respond);

/**
 * All Doctors — public browsing endpoint with optional ?specialization= filter
 */
apiRouter.get('/doctors/all', async (req, res) => {
    try {
        const { specialization } = req.query;
        const doctors = await recommendationController.service.getAllDoctors(specialization);
        res.json(doctors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Appointment Slots — get available slots for a doctor by their User ID
 */
apiRouter.get('/appointments/slots/:doctorUserId', authMiddleware, async (req, res) => {
    try {
        const { doctorUserId } = req.params;
        const doctorProfile = await Doctor.findOne({ user: doctorUserId });
        if (!doctorProfile) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        const slots = await AppointmentSlot.find({
            doctor: doctorProfile._id,
            status: 'AVAILABLE',
            startTime: { $gte: new Date() }
        }).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Records — delete a record by ID (Fix 1)
 * In the current implementation, records are client-side only.
 * This route is a placeholder for when records are persisted to a database/MinIO.
 */
apiRouter.delete('/records/:id', authMiddleware, async (req, res) => {
    try {
        // TODO: When records are stored in DB/MinIO, delete the document and object here
        // const record = await Record.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        // if (!record) return res.status(404).json({ error: 'Record not found' });
        // if (record.minioKey) await minioClient.removeObject(bucket, record.minioKey);
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = apiRouter;
