const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = admin =>
  jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '12h',
  });

exports.registerAdmin = async (req, res) => {
  const { userId, firstName, lastName, password } = req.body;
  if (!userId || !firstName || !lastName || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ userId: userId.trim() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'User ID already exists' });
    }

    const newAdmin = new Admin({
      userId: userId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res
      .status(400)
      .json({ message: 'User ID and password are required' });
  }

  try {
    const admin = await Admin.findOne({ userId: userId.trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.matchPassword(password.trim());
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(admin);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin._id,
        userId: admin.userId,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Middleware to protect routes
exports.protectAdmin = (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not admin role');
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

exports.getDashboardData = async (req, res) => {
  // Example protected data for admin
  res.json({
    message: `Welcome Admin ${req.adminId}, here is your dashboard data.`,
  });
};
