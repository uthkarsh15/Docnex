const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[DB] Connected to MongoDB Atlas');
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
