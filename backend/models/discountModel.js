const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    offer: {
      type: Number,
      required: [true, 'Offer percentage is required'],
      min: [0, 'Offer must be at least 0%'],
      max: [100, 'Offer cannot exceed 100%'],
    },
    img: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Discount', discountSchema);
