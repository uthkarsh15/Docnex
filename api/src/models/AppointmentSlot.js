const mongoose = require('mongoose');

const appointmentSlotSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BOOKED'],
        default: 'AVAILABLE'
    }
}, {
    timestamps: true
});

// Unique constraint to prevent double booking the same slot time for a doctor
appointmentSlotSchema.index({ doctor: 1, startTime: 1, endTime: 1 }, { unique: true });

module.exports = mongoose.model('AppointmentSlot', appointmentSlotSchema);
