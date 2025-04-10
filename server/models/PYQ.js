const mongoose = require('mongoose');

const PYQSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  examType: {
    type: String,
    enum: ['MST 1', 'MST 2', 'END SEM'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  fileURLs: {
    type: [String],
    required: true
  },
  fileIds: {
    type: [String],
    required: true
  },
  // Keep the old fields for backward compatibility
  fileURL: {
    type: String
  },
  fileId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PYQ', PYQSchema);
