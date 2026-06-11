const Product = require('../models/Product');

// @desc    Fetch all products (with optional search keyword)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // 1. Check if the frontend sent a keyword in the URL query
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i', // Case-insensitive (e.g., 'iphone' matches 'iPhone')
          },
        }
      : {}; 

    // 2. Find products matching the keyword (if any)
    const products = await Product.find({ ...keyword });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // If the ID is completely malformed, Mongoose throws a CastError
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};