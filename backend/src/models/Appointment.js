const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppointmentSlot',
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);