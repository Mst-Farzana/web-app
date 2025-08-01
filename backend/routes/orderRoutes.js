const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController'); // ইম্পোর্ট ঠিক আছে

router.post('/', createOrder);
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
