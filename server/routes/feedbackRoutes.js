const express = require('express');
const router = express.Router();
const { 
  submitFeedback, 
  getAllFeedback, 
  getUserFeedback,
  updateFeedbackStatus
} = require('../controllers/feedbackController');
const { userAuth, adminAuth } = require('../middleware/auth');

// User routes - require user authentication
router.post('/', userAuth, submitFeedback);
router.get('/me', userAuth, getUserFeedback);

// Admin routes - require admin authentication
router.get('/', adminAuth, getAllFeedback);
router.put('/:id', adminAuth, updateFeedbackStatus);

module.exports = router;
