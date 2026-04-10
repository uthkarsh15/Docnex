const Doctor = require('../models/Doctor');
const AppointmentSlot = require('../models/AppointmentSlot');

class RecommendationService {
    async recommendDoctors(specialization, location) {
        // 1. Filter by Specialization and Location
        let candidates = await Doctor.find({ specialization, location }).populate('user');

        // Fallback: If no specialist found, try General Physician
        if (candidates.length === 0 && specialization !== 'General Physician') {
            candidates = await Doctor.find({ specialization: 'General Physician', location }).populate('user');
        }

        // 2. Rank candidates
        const scoredCandidates = await Promise.all(candidates.map(async (doctor) => {
            const score = await this.calculateScore(doctor);
            return { doctor, score };
        }));

        return scoredCandidates
            .sort((a, b) => b.score - a.score)
            .map(item => this.mapToProfile(item.doctor));
    }

    async recommendBySymptom(symptom, location) {
        const specialization = this.resolveSpecialty(symptom);
        return this.recommendDoctors(specialization, location);
    }

    resolveSpecialty(symptom) {
        symptom = symptom.toLowerCase();
        if (symptom.includes('heart') || symptom.includes('chest')) return 'Cardiologist';
        if (symptom.includes('skin') || symptom.includes('rash')) return 'Dermatologist';
        if (symptom.includes('tooth') || symptom.includes('gum')) return 'Dentist';
        if (symptom.includes('headache') || symptom.includes('brain')) return 'Neurologist';
        return 'General Physician';
    }

    async calculateScore(doctor) {
        const experienceScore = doctor.experienceYears * 1.5;
        const ratingScore = (doctor.rating || 0) * 2.5;

        // Count available slots
        const availableSlotsCount = await AppointmentSlot.countDocuments({
            doctor: doctor._id,
            status: 'AVAILABLE'
        });

        return experienceScore + ratingScore + (availableSlotsCount * 1.0);
    }

    mapToProfile(doctor) {
        return {
            userId: doctor.user?._id || doctor.user,
            fullName: doctor.user?.fullName || 'N/A',
            specialization: doctor.specialization,
            experienceYears: doctor.experienceYears,
            consultationFee: doctor.consultationFee,
            location: doctor.location,
            bio: doctor.bio,
            isVerified: doctor.isVerified,
            rating: doctor.rating
        };
    }
}

module.exports = new RecommendationService();
