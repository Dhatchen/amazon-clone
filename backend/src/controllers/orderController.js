const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    const order = await Order.create({
      user: req.user.id, 
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (order.isDelivered) {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order that has already been delivered' });
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/v1/orders/stripe-checkout
// @access  Private
exports.createStripeCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Dynamically set payment method types based on user selection
    let paymentMethodTypes = ['card'];
    if (order.paymentMethod === 'UPI') {
      paymentMethodTypes = ['upi'];
    }

    // Tell Stripe to create a hosted checkout page
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes, 
      line_items: [
        {
          price_data: {
            currency: 'inr', 
            product_data: {
              name: `Order ${order._id}`,
            },
            // Stripe expects paise, so multiply by 100
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Prefill user email on Stripe Checkout
      customer_email: req.user.email,
      // The URLs Stripe will send the user back to
      success_url: `http://localhost:5173/order/${order._id}?payment=success`,
      cancel_url: `http://localhost:5173/order/${order._id}?payment=cancelled`,
    });

    // Send the Stripe URL back to React
    res.status(200).json({
      success: true,
      url: session.url, 
    });
  } catch (error) {
    console.error("STRIPE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order to paid in MongoDB
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      
      const updatedOrder = await order.save();
      res.status(200).json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};