const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // make sure env var matches!
    console.log('🔌 MongoDB Connected');

    const existing = await Admin.findOne({ userId: 'admin123' });

    if (existing) {
      console.log('⚠️ Admin user already exists.');
    } else {
      const newAdmin = new Admin({
        userId: 'admin123',
        firstName: 'Site',
        lastName: 'Owner',
        password: 'AdminPass@2025',
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
