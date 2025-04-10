const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `pyq-${uniqueSuffix}${fileExt}`);
  }
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  try {
    console.log('Processing file:', file.originalname, 'fieldname:', file.fieldname);
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not supported. Please upload PDF, JPG, or PNG files only. Received: ${ext}`));
    }
  } catch (error) {
    cb(new Error(`Error processing file: ${error.message}`));
  }
};

// Create and export the multer middleware
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 15 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: fileFilter
});

// Helper to convert server path to URL
const getFileUrl = (filename) => {
  return `/uploads/${filename}`;
};

module.exports = {
  upload,
  getFileUrl
};
