const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const path = require('path');

// Upload report
router.post('/upload', authenticate, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileInfo = {
      fileName: req.file.originalname,
      filePath: `/uploads/${req.body.uploadType || 'reports'}/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date()
    };

    res.status(201).json({ 
      message: 'File uploaded successfully', 
      file: fileInfo 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Upload multiple reports
router.post('/upload-multiple', authenticate, upload.array('reports', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const filesInfo = req.files.map(file => ({
      fileName: file.originalname,
      filePath: `/uploads/${req.body.uploadType || 'reports'}/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    }));

    res.status(201).json({ 
      message: 'Files uploaded successfully', 
      files: filesInfo 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

module.exports = router;
