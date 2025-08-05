const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// ✅ Middleware
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

// ✅ Controllers
const {
  getDiscounts,
  createDiscount,
  updateDiscount,
  softDeleteDiscount,
  restoreDiscount,
  getDeletedDiscounts,
} = require('../controllers/discountController');

const { protectAdmin } = require('../controllers/adminController');

// =======================
//        Routes
// =======================

// 🔓 Public: Get all active discounts
router.get('/', getDiscounts);

// 🔒 Admin: Get soft-deleted discounts
router.get('/deleted', protectAdmin, getDeletedDiscounts);

// 🔒 Admin: Create discount
router.post('/', protectAdmin, createDiscount);

// 🔒 Admin: Update discount by ID
router.put('/:id', protectAdmin, validateObjectId, updateDiscount);

// 🔒 Admin: Soft delete discount
router.delete('/:id', protectAdmin, validateObjectId, softDeleteDiscount);

// 🔒 Admin: Restore soft-deleted discount
router.patch('/restore/:id', protectAdmin, validateObjectId, restoreDiscount);

module.exports = router;
