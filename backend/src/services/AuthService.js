const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

class AuthService {
    async register(data) {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('Email already exists!');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.password, salt);

        const user = new User({
            email: data.email,
            fullName: data.fullName,
            passwordHash,
            role: data.role
        });

        const savedUser = await user.save();

        if (data.role === 'DOCTOR') {
            const doctor = new Doctor({
                user: savedUser._id,
                specialization: data.specialization,
                experienceYears: data.experienceYears,
                consultationFee: data.consultationFee,
                location: data.location,
                hospital: data.hospital,
                bio: data.bio
            });
            await doctor.save();
        }

        return { message: 'User registered successfully!' };
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );

        return { token, user: { id: user._id, role: user.role, name: user.fullName } };
    }
}

module.exports = new AuthService();
