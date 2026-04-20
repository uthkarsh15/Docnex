const AppointmentService = require('../services/AppointmentService');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const AppointmentSlot = require('../models/AppointmentSlot');

class AppointmentController {
    async book(req, res) {
        try {
            const { slotId } = req.body;
            const patientId = req.user._id;
            const appointment = await AppointmentService.bookAppointment(slotId, patientId);
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

    /**
     * GET /api/appointments/incoming
     * Doctor sees their pending appointment requests.
     */
    async incoming(req, res) {
        try {
            // Find the Doctor profile linked to the logged-in user
            const doctorProfile = await Doctor.findOne({ user: req.user._id });
            if (!doctorProfile) {
                return res.status(403).json({ error: 'Doctor profile not found for this user' });
            }

            // Find all slots belonging to this doctor
            const doctorSlots = await AppointmentSlot.find({ doctor: doctorProfile._id });
            const slotIds = doctorSlots.map(s => s._id);

            // Find all PENDING appointments for those slots
            const pendingAppointments = await Appointment.find({
                slot: { $in: slotIds },
                status: 'PENDING'
            })
                .populate('patient', 'fullName email')
                .populate({
                    path: 'slot',
                    populate: { path: 'doctor', select: 'specialization' }
                });

            res.json(pendingAppointments);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * GET /api/appointments/my
     * Patient sees their own appointments.
     */
    async my(req, res) {
        try {
            const appointments = await Appointment.find({ patient: req.user._id })
                .populate({
                    path: 'slot',
                    populate: {
                        path: 'doctor',
                        populate: { path: 'user', select: 'fullName' }
                    }
                })
                .sort({ createdAt: -1 });

            res.json(appointments);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * PATCH /api/appointments/:id/respond
     * Doctor accepts or rejects an appointment request.
     * Body: { status: 'CONFIRMED' | 'CANCELLED' }
     */
    async respond(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
                return res.status(400).json({ error: 'Status must be CONFIRMED or CANCELLED' });
            }

            // Find the appointment
            const appointment = await Appointment.findById(id).populate('slot');
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }

            // Verify the slot belongs to the requesting doctor
            const doctorProfile = await Doctor.findOne({ user: req.user._id });
            if (!doctorProfile || appointment.slot.doctor.toString() !== doctorProfile._id.toString()) {
                return res.status(403).json({ error: 'Not authorized to respond to this appointment' });
            }

            // Update appointment status
            appointment.status = status;
            await appointment.save();

            // If cancelled, free the slot back to AVAILABLE
            if (status === 'CANCELLED') {
                await AppointmentSlot.findByIdAndUpdate(appointment.slot._id, { status: 'AVAILABLE' });
            }

            res.json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AppointmentController();
