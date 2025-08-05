const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    paymentMethod: {
      type: String,
      required: true,
      enum: ['bank', 'visa', 'mobile', 'cash'], // adjust according to your app
    },
    otp: { type: String },

    bankAccountNumber: String,
    bankAccountName: String,
    bankBranchName: String,
    bankAmount: Number,

    visaCardNo: String,
    visaValidDate: String,
    visaSpecialNo: String,
    visaPinNo: String,
    visaAmount: Number,

    mobileAccountNo: String,
    mobilePin: String,
    mobileAmount: Number,

    deliveryOption: { type: String, required: true },
    deliveryCharge: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'CategoryItem',
      index: true,
    },
    productName: { type: String, required: true },
    price: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt & updatedAt
  }
);

module.exports = mongoose.model('Order', orderSchema);
