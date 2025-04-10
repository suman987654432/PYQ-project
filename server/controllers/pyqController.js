const PYQ = require('../models/PYQ');
const fs = require('fs');
const path = require('path');
const { getFileUrl } = require('../utils/fileStorage');

// Add a new PYQ
exports.addPYQ = async (req, res) => {
  try {
    console.log("Request body received:", Object.keys(req.body));
    const { course, branch, semester, examType, subject, year } = req.body;
    
    // Verify we have all required data
    if (!course || !branch || !semester || !examType || !subject || !year || !req.files || req.files.length === 0) {
      console.error("Missing required fields:", { 
        hasCourse: !!course, 
        hasBranch: !!branch, 
        hasSemester: !!semester,
        hasExamType: !!examType,
        hasSubject: !!subject,
        hasYear: !!year,
        hasFiles: !!(req.files && req.files.length > 0)
      });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Get file details from multer
    const fileURLs = req.files.map(file => `http://localhost:5000${getFileUrl(file.filename)}`);
    const fileIds = req.files.map(file => file.filename);
    
    console.log("Files uploaded successfully:", fileIds);

    // Create new PYQ document with multiple files
    const newPYQ = new PYQ({
      course,
      branch,
      semester: Number(semester),
      examType,
      subject,
      year: Number(year),
      fileURLs,
      fileIds,
      // For backward compatibility
      fileURL: fileURLs[0],
      fileId: fileIds[0]
    });

    await newPYQ.save();
    console.log("PYQ saved to database with ID:", newPYQ._id);
    res.status(201).json({ success: true, data: newPYQ });
  } catch (error) {
    console.error('Error adding PYQ:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.response?.data || 'No additional details'
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'Error adding PYQ: ' + error.message,
      errorName: error.name,
      errorDetails: error.response?.data || {}
    });
  }
};

// Get all PYQs
exports.getAllPYQs = async (req, res) => {
  try {
    const pyqs = await PYQ.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pyqs.length, data: pyqs });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching PYQs',
      error: error.message 
    });
  }
};

// Get PYQs by filter
exports.getPYQsByFilter = async (req, res) => {
  try {
    const { course, branch, semester, examType } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Make course filter completely case-insensitive and partial matching
    if (course) {
      filter.course = { $regex: course, $options: 'i' };
    }
    
    if (branch) filter.branch = branch;
    if (semester) filter.semester = Number(semester);
    if (examType) filter.examType = examType;
    
    const pyqs = await PYQ.find(filter).sort({ year: -1 });
    res.status(200).json({ success: true, count: pyqs.length, data: pyqs });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: 'Error fetching PYQs with filter',
      error: error.message 
    });
  }
};

// Get a single PYQ
exports.getPYQ = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ success: false, message: 'PYQ not found' });
    }
    
    res.status(200).json({ success: true, data: pyq });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching PYQ',
      error: error.message 
    });
  }
};

// Update a PYQ
exports.updatePYQ = async (req, res) => {
  try {
    let pyq = await PYQ.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ success: false, message: 'PYQ not found' });
    }
    
    // If new files are uploaded
    if (req.files && req.files.length > 0) {
      // Delete existing files
      const existingFileIds = pyq.fileIds || [];
      if (pyq.fileId && !existingFileIds.includes(pyq.fileId)) {
        existingFileIds.push(pyq.fileId);
      }
      
      existingFileIds.forEach(fileId => {
        const filePath = path.join(__dirname, '../uploads', fileId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
      
      // Get new file details from multer
      const fileURLs = req.files.map(file => `http://localhost:5000${getFileUrl(file.filename)}`);
      const fileIds = req.files.map(file => file.filename);
      
      req.body.fileURLs = fileURLs;
      req.body.fileIds = fileIds;
      // For backward compatibility
      req.body.fileURL = fileURLs[0];
      req.body.fileId = fileIds[0];
    }
    
    // Update PYQ document
    pyq = await PYQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({ success: true, data: pyq });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating PYQ',
      error: error.message 
    });
  }
};

// Delete a PYQ
exports.deletePYQ = async (req, res) => {
  try {
    const pyq = await PYQ.findById(req.params.id);
    
    if (!pyq) {
      return res.status(404).json({ success: false, message: 'PYQ not found' });
    }
    
    // Delete files from server
    const fileIds = pyq.fileIds || [];
    if (pyq.fileId && !fileIds.includes(pyq.fileId)) {
      fileIds.push(pyq.fileId);
    }
    
    fileIds.forEach(fileId => {
      const filePath = path.join(__dirname, '../uploads', fileId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    // Delete document from DB
    await PYQ.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: 'PYQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting PYQ',
      error: error.message 
    });
  }
};
