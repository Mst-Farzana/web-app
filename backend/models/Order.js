const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true }, // ✅ Add this line
  phone: { type: String, required: true },
  address: { type: String, required: true },

  paymentMethod: { type: String, required: true },
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
  },
  productName: { type: String, required: true },
  price: { type: Number, required: true },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
