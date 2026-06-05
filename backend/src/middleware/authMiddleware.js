const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the token was sent in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract the token string (Remove the word "Bearer ")
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. If no token exists, reject the request
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized to access this route. Please log in.' 
    });
  }

  try {
    // 3. Verify the token using your secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in the database and attach them to the request object
    req.user = await User.findById(decoded.id);

    // 5. Move on to the actual controller function (createOrder)
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token is invalid or expired. Please log in again.' 
    });
  }
};