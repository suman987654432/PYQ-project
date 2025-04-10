const Feedback = require('../models/Feedback');

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { type, subject, message, rating } = req.body;
    
    // Validate required fields
    if (!type || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }
    
    // Create new feedback with user ID from auth middleware
    const feedback = await Feedback.create({
      user: req.userId,
      type,
      subject,
      message,
      rating: rating || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during feedback submission',
      error: error.message
    });
  }
};

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    // Verification is already done in the middleware
    console.log("Admin fetching feedback, admin ID:", req.adminId);
    
    const feedback = await Feedback.find()
      .populate('user', 'name email') // Include user name and email
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching feedback',
      error: error.message
    });
  }
};

// Get user's feedback
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });
    
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user feedback',
      error: error.message
    });
  }
};

// Update feedback status (admin only)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: feedback
    });
    
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating feedback status',
      error: error.message
    });
  }
};
