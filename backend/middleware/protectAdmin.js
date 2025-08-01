const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found:', token);
  } else {
    console.log('No token found in request headers');
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      console.log('Admin not found for token:', decoded.id);
      return res
        .status(401)
        .json({ message: 'Not authorized, admin not found' });
    }

    console.log('Admin authorized:', req.admin._id);
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protectAdmin;
