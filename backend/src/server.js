require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Express
const app = express();

// Connect to MongoDB Atlas
connectDB();

// --- Global Middleware ---
// 1. Security Headers
app.use(helmet()); 

// 2. Cross-Origin Resource Sharing (allow frontend to talk to backend)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default port
  credentials: true
}));

// 3. Body Parser (allows accepting JSON data in requests)
app.use(express.json());

// 4. HTTP Request Logging (useful for debugging)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Basic Route (Sanity Check) ---
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running beautifully.' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// --- Server Boot ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});