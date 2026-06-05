const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxLength: [120, 'Name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
      default: 'https://via.placeholder.com/400'
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      default: 0.0,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      // We updated this array to perfectly match our mock data seeder
      enum: [
        'Electronics', 
        'Fashion', 
        'Home & Kitchen', 
        'Books', 
        'Beauty',
        'Sports & Outdoors', 
        'Automotive', 
        'Toys & Games', 
        'Health', 
        'Groceries'
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true, // Ties the product to a specific user with the 'seller' role
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  { timestamps: true }
);

// Advanced Indexing for faster search queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);