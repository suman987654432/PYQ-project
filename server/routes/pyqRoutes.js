const express = require('express');
const router = express.Router();
const {
  addPYQ,
  getAllPYQs,
  getPYQsByFilter,
  getPYQ,
  updatePYQ,
  deletePYQ
} = require('../controllers/pyqController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/fileStorage');

// Protect all routes
router.use(authMiddleware);

// PYQ routes - wrap multer middleware in error handling
router.post('/', (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error in POST route:', err);
      return res.status(400).json({ 
        success: false, 
        message: `File upload error: ${err.message}` 
      });
    }
    next();
  });
}, addPYQ);

router.get('/', getAllPYQs);
router.get('/filter', getPYQsByFilter);
router.get('/:id', getPYQ);

router.put('/:id', (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error in PUT route:', err);
      return res.status(400).json({ 
        success: false, 
        message: `File upload error: ${err.message}` 
      });
    }
    next();
  });
}, updatePYQ);

router.delete('/:id', deletePYQ);

module.exports = router;
