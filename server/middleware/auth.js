const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const mongoose = require('mongoose');

// User authentication middleware
exports.userAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }
    
    // Set user id to request
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server authentication error'
    });
  }
};

// Admin authentication middleware
exports.adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      
      // Check if decoded contains email instead of id
      // This is a workaround to support both ObjectId and non-ObjectId identifiers
      let admin;
      
      if (decoded.id && !mongoose.Types.ObjectId.isValid(decoded.id)) {
        // If ID is not a valid ObjectId, try to find admin by email
        admin = await Admin.findOne({ email: decoded.email }).select('-password');
      } else {
        // Otherwise try to find by ID
        admin = await Admin.findById(decoded.id).select('-password');
      }
      
      if (!admin) {
        return res.status(401).json({ 
          success: false, 
          message: 'Admin not found' 
        });
      }
      
      // Add admin id to request
      req.adminId = admin._id;
      req.admin = admin;
      next();
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication'
    });
  }
};
