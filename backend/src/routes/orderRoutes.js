const express = require('express');

// CRITICAL FIX: All 6 controller functions must be imported here
const { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  cancelOrder, 
  createStripeCheckout, 
  updateOrderToPaid 
} = require('../controllers/orderController'); 

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get order history
router.route('/myorders').get(protect, getMyOrders);

// Create an order
router.route('/').post(protect, createOrder);

router.route('/stripe-checkout').post(protect, createStripeCheckout);

// Mark Order as Paid
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Get Single Order Details (Must be below the other routes to avoid conflicts)
router.route('/:id').get(protect, getOrderById);

// Cancel an Order
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;