const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const AppointmentSlot = require('../models/AppointmentSlot');
const User = require('../models/User');

class AppointmentService {
    async bookAppointment(slotId, patientEmail) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Fetch Patient
            const patient = await User.findOne({ email: patientEmail }).session(session);
            if (!patient) {
                throw new Error('Patient not found');
            }

            // 2. Fetch Slot and lock it (implicitly via transaction and update)
            const slot = await AppointmentSlot.findById(slotId).session(session);
            if (!slot) {
                throw new Error('Slot not found');
            }

            // 3. Check availability
            if (slot.status !== 'AVAILABLE') {
                throw new Error('Slot is not available');
            }

            // 4. Update Slot Status
            slot.status = 'BOOKED';
            await slot.save({ session });

            // 5. Create Appointment
            const appointment = new Appointment({
                patient: patient._id,
                slot: slot._id,
                status: 'CONFIRMED'
            });

            const savedAppointment = await appointment.save({ session });

            await session.commitTransaction();
            session.endSession();

            // In a real app, you'd trigger events/notifications here
            return savedAppointment;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async cancelAppointment(appointmentId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const appointment = await Appointment.findById(appointmentId).session(session);
            if (!appointment) {
                throw new Error('Appointment not found');
            }

            if (appointment.status === 'CANCELLED') {
                throw new Error('Appointment is already cancelled');
            }

            appointment.status = 'CANCELLED';
            await appointment.save({ session });

            // Free up the slot
            const slot = await AppointmentSlot.findById(appointment.slot).session(session);
            if (slot) {
                slot.status = 'AVAILABLE';
                await slot.save({ session });
            }

            await session.commitTransaction();
            session.endSession();
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    async completeAppointment(appointmentId) {
        return await Appointment.findByIdAndUpdate(appointmentId, { status: 'COMPLETED' }, { new: true });
    }
}

module.exports = new AppointmentService();
