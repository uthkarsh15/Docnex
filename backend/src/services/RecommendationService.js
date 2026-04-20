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

    /**
     * GET /api/doctors/all
     * Returns all doctors sorted by descending score.
     * Accepts optional specialization filter.
     */
    async getAllDoctors(specialization) {
        const filter = specialization ? { specialization } : {};
        const candidates = await Doctor.find(filter).populate('user');

        const scoredCandidates = await Promise.all(candidates.map(async (doctor) => {
            const score = await this.calculateScore(doctor);
            return { doctor, score };
        }));

        return scoredCandidates
            .sort((a, b) => b.score - a.score)
            .map(item => ({ ...this.mapToProfile(item.doctor), score: item.score }));
    }

    resolveSpecialty(symptom) {
        symptom = symptom.toLowerCase();
        if (symptom.includes('heart') || symptom.includes('chest')) return 'Cardiologist';
        if (symptom.includes('skin') || symptom.includes('rash')) return 'Dermatologist';
        if (symptom.includes('tooth') || symptom.includes('gum')) return 'Dentist';
        if (symptom.includes('headache') || symptom.includes('brain')) return 'Neurologist';
        return 'General Physician';
    }

    /**
     * Weighted scoring formula:
     * score = (experienceYears * 0.35) + (rating * 10 * 0.35) + (availableSlots > 0 ? 20 : 0) * 0.20 + (isAIIMS ? 15 : 0) * 0.10
     */
    async calculateScore(doctor) {
        const experienceComponent = doctor.experienceYears * 0.35;
        const ratingComponent = (doctor.rating || 0) * 10 * 0.35;

        // Count available slots
        const availableSlotsCount = await AppointmentSlot.countDocuments({
            doctor: doctor._id,
            status: 'AVAILABLE'
        });
        const availabilityComponent = (availableSlotsCount > 0 ? 20 : 0) * 0.20;
        const aiimsComponent = (doctor.isAIIMS ? 15 : 0) * 0.10;

        return experienceComponent + ratingComponent + availabilityComponent + aiimsComponent;
    }

    mapToProfile(doctor) {
        return {
            doctorId: doctor._id,
            userId: doctor.user?._id || doctor.user,
            fullName: doctor.user?.fullName || 'N/A',
            specialization: doctor.specialization,
            experienceYears: doctor.experienceYears,
            consultationFee: doctor.consultationFee,
            location: doctor.location,
            hospital: doctor.hospital,
            bio: doctor.bio,
            isVerified: doctor.isVerified,
            isAIIMS: doctor.isAIIMS,
            rating: doctor.rating
        };
    }
}

module.exports = new RecommendationService();

