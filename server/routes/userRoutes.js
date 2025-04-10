const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const userAuthMiddleware = require('../middleware/userAuthMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', userAuthMiddleware, getUserProfile);

module.exports = router;
