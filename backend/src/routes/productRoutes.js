const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Maps to: /api/v1/products
router.route('/').get(getProducts);

// Maps to: /api/v1/products/:id
router.route('/:id').get(getProductById);

module.exports = router;