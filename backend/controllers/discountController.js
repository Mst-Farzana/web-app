const Discount = require('../models/discountModel');

// ✅ Get only active discounts (not soft-deleted)
const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({ isDeleted: { $ne: true } });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounts' });
  }
};

// ✅ Create a new discount
const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.json(discount);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create discount', error });
  }
};

// ✅ Soft delete (set isDeleted = true)
const softDeleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { $set: { isDeleted: true } });
    res.status(200).json({ message: 'Discount soft-deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error soft-deleting discount' });
  }
};

// ✅ Restore soft-deleted discount (set isDeleted = false)
const restoreDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { $set: { isDeleted: false } });
    res.status(200).json({ message: 'Discount restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring discount' });
  }
};

// ✅ Update discount (fixed)
const updateDiscount = async (req, res) => {
  try {
    const updated = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures validation rules apply
    });

    if (!updated) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update Error:', error);
    res.status(400).json({
      message: 'Failed to update discount',
      error: error.message || 'Validation failed',
    });
  }
};

// ✅ Optional: Get deleted discounts (for admin use)
const getDeletedDiscounts = async (req, res) => {
  try {
    const deleted = await Discount.find({ isDeleted: true });
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deleted discounts' });
  }
};

module.exports = {
  getDiscounts,
  createDiscount,
  softDeleteDiscount,
  restoreDiscount,
  updateDiscount,
  getDeletedDiscounts,
};
