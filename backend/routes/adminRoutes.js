const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  protectAdmin,
  getDashboardData,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard-data', protectAdmin, getDashboardData);

module.exports = router;
