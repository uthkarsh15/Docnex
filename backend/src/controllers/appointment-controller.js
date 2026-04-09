const AppointmentService = require('../services/AppointmentService');

class AppointmentController {
    async book(req, res) {
        try {
            const { slotId } = req.body;
            const patientEmail = req.user.email; // Assuming email is in JWT payload
            const appointment = await AppointmentService.bookAppointment(slotId, patientEmail);
            res.status(201).json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async cancel(req, res) {
        try {
            const { id } = req.params;
            await AppointmentService.cancelAppointment(id);
            res.json({ message: 'Appointment cancelled successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async complete(req, res) {
        try {
            const { id } = req.params;
            const appointment = await AppointmentService.completeAppointment(id);
            res.json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AppointmentController();
