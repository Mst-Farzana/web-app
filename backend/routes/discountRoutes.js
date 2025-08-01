const express = require('express');
const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  next();
};

const {
  getDiscounts,
  createDiscount,
  updateDiscount,
  softDeleteDiscount,
  restoreDiscount,
  getDeletedDiscounts,
} = require('../controllers/discountController');

const { protectAdmin } = require('../controllers/adminController');

const router = express.Router();

// 🟢 Public route - Get all active (non-deleted) discounts
router.get('/', getDiscounts);

// 🔒 Admin-only route - View soft-deleted discounts
router.get('/deleted', protectAdmin, getDeletedDiscounts);

// 🔒 Admin-only route - Create new discount
router.post('/', protectAdmin, createDiscount);

// 🔒 Admin-only route - Update discount
router.put('/:id', protectAdmin, validateObjectId, updateDiscount);

// 🔒 Admin-only route - Soft delete (set isDeleted = true)
router.delete('/:id', protectAdmin, validateObjectId, softDeleteDiscount);

// 🔒 Admin-only route - Restore previously deleted discount
router.patch('/restore/:id', protectAdmin, validateObjectId, restoreDiscount);

module.exports = router;
