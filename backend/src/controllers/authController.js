const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Moved to the top!

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // 2. Check if user exists (and explicitly pull the password from the DB for checking)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // Bulletproof ID lookup
    const user = await User.findById(req.user._id || req.user.id);

    if (user) {
      // Update fields if they were provided in the request
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // Only update password if the user actually typed a new one
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Save the updated user (this will automatically re-hash the password if changed!)
      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error); // Logs the exact error to your terminal
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Bulletproof ID lookup
    const user = await User.findById(req.user._id || req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: user 
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};