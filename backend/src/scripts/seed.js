require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const AppointmentSlot = require('../models/AppointmentSlot');

const PATIENTS = [
    { fullName: 'Priya Sharma',  email: 'priya@docnex.in',  password: 'priya123',  role: 'PATIENT' },
    { fullName: 'Arjun Mehta',   email: 'arjun@docnex.in',  password: 'arjun123',  role: 'PATIENT' },
    { fullName: 'Sunita Verma',  email: 'sunita@docnex.in', password: 'sunita123', role: 'PATIENT' },
];

const DOCTORS = [
    { fullName: 'Dr. Rajeev Gupta',     email: 'rgupta@docnex.in',     password: 'rgupta123',     specialization: 'Cardiology',       experienceYears: 18, rating: 4.8, hospital: 'AIIMS New Delhi',  isAIIMS: true,  consultationFee: 800, location: 'New Delhi' },
    { fullName: 'Dr. Meena Agarwal',    email: 'magarwal@docnex.in',   password: 'magarwal123',   specialization: 'Endocrinology',    experienceYears: 14, rating: 4.7, hospital: 'AIIMS New Delhi',  isAIIMS: true,  consultationFee: 750, location: 'New Delhi' },
    { fullName: 'Dr. Suresh Nair',      email: 'snair@docnex.in',      password: 'snair123',      specialization: 'Orthopedics',      experienceYears: 22, rating: 4.9, hospital: 'AIIMS Jodhpur',    isAIIMS: true,  consultationFee: 900, location: 'Jodhpur' },
    { fullName: 'Dr. Kavita Singh',     email: 'ksingh@docnex.in',     password: 'ksingh123',     specialization: 'Neurology',        experienceYears: 16, rating: 4.6, hospital: 'AIIMS Rishikesh',  isAIIMS: true,  consultationFee: 850, location: 'Rishikesh' },
    { fullName: 'Dr. Arun Khanna',      email: 'akhanna@docnex.in',    password: 'akhanna123',    specialization: 'General Medicine', experienceYears: 20, rating: 4.7, hospital: 'AIIMS Bhopal',     isAIIMS: true,  consultationFee: 600, location: 'Bhopal' },
    { fullName: 'Dr. Amit Bose',        email: 'abose@docnex.in',      password: 'abose123',      specialization: 'Cardiology',       experienceYears: 11, rating: 4.5, hospital: 'Max Healthcare',    isAIIMS: false, consultationFee: 700, location: 'New Delhi' },
    { fullName: 'Dr. Pooja Iyer',       email: 'piyer@docnex.in',      password: 'piyer123',      specialization: 'Endocrinology',    experienceYears: 9,  rating: 4.4, hospital: 'Apollo Hospitals',  isAIIMS: false, consultationFee: 650, location: 'Mumbai' },
    { fullName: 'Dr. Vikram Choudhary', email: 'vchoudhary@docnex.in', password: 'vchoudhary123', specialization: 'Orthopedics',      experienceYears: 13, rating: 4.6, hospital: 'Fortis',            isAIIMS: false, consultationFee: 720, location: 'Gurugram' },
    { fullName: 'Dr. Nalini Reddy',     email: 'nreddy@docnex.in',     password: 'nreddy123',     specialization: 'Dermatology',      experienceYears: 8,  rating: 4.3, hospital: 'Manipal',           isAIIMS: false, consultationFee: 500, location: 'Bangalore' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[SEED] Connected to Atlas');

  // Skip wiping if needed, but the original script does it
  await Appointment.deleteMany({});
  await AppointmentSlot.deleteMany({});
  await Doctor.deleteMany({});
  await User.deleteMany({});
  console.log('[SEED] Cleared Users, Doctors, AppointmentSlots, Appointments.');

  // Seed patients
  for (const p of PATIENTS) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(p.password, salt);
    await User.create({
      fullName: p.fullName,
      email: p.email,
      passwordHash,
      role: p.role,
    });
    console.log(`  [PATIENT] ${p.fullName} (${p.email})`);
  }

  // Seed doctors
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  for (const d of DOCTORS) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(d.password, salt);

    const user = await User.create({
      fullName: d.fullName,
      email: d.email,
      passwordHash,
      role: 'DOCTOR',
    });

    const doctor = await Doctor.create({
      user: user._id,
      specialization: d.specialization,
      experienceYears: d.experienceYears,
      consultationFee: d.consultationFee,
      location: d.location,
      hospital: d.hospital,
      isAIIMS: d.isAIIMS,
      isVerified: true,
      rating: d.rating,
    });

    console.log(`  [DOCTOR] ${d.fullName} (${d.specialization}, ${d.hospital})`);

    // Seed 6 future slots per doctor
    for (let hour = 0; hour < 6; hour++) {
      const startTime = new Date(tomorrow);
      startTime.setHours(9 + hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      await AppointmentSlot.create({
        doctor: doctor._id,
        startTime,
        endTime,
        status: 'AVAILABLE',
      });
    }
    console.log(`    → 6 slots created (09:00–15:00 tomorrow)`);
  }

  await mongoose.disconnect();
  console.log('[SEED] Done');
}

seed().catch(console.error);
