// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const adminRoutes = require('./routes/adminsRoute');
const pyqRoutes = require('./routes/pyqRoutes');
const userRoutes = require('./routes/userRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
  
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/admin', adminRoutes);
app.use('/api/pyq', pyqRoutes);
app.use('/api/user', userRoutes);
app.use('/api/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
