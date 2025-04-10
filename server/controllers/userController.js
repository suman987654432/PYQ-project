const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, roll, email, password, course } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { roll }] });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or roll number already exists' 
      });
    }
    
    // Create new user
    user = new User({
      name,
      roll,
      email,
      password, // Will be hashed via the pre-save hook
      course
    });
    
    await user.save();
    
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login.'
    });
    
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration'
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        roll: user.roll,
        email: user.email,
        course: user.course
      }
    });
    
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login'
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user profile'
    });
  }
};
