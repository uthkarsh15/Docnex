const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: true,
        index: true
    },
    experienceYears: {
        type: Number,
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    bio: {
        type: String
    },
    location: {
        type: String,
        required: true,
        index: true
    },
    hospital: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0.0
    },
    isAIIMS: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
