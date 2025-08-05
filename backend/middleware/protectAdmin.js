const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: not an admin' });
    }

    // Fetch admin and exclude password explicitly
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res
        .status(401)
        .json({ message: 'Not authorized, admin not found' });
    }

    // Attach admin info to request object for use in routes
    req.admin = admin.toObject();

    next();
  } catch (err) {
    console.error('Auth middleware error:', err); // Optional: log error for debugging
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protectAdmin };
