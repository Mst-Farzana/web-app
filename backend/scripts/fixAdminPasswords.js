const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

dotenv.config();

const fixPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const admins = await Admin.find();
    for (const admin of admins) {
      if (!admin.password.startsWith('$2a$')) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
        await admin.save();
        console.log(`✅ Hashed password for: ${admin.userId}`);
      } else {
        console.log(`🔒 Already hashed: ${admin.userId}`);
      }
    }

    mongoose.disconnect();
    console.log('✅ Done.');
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

fixPasswords();
