import express from 'express'
import { protect, authorize } from '../middleware/auth.js'
import { uploadSingle, uploadMultiple } from '../middleware/upload.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Upload single image (admin only)
router.post('/single', protect, authorize('admin', 'super-admin'), uploadSingle, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      })
    }

    const fileUrl = `/uploads/${req.file.fieldname}/${req.file.filename}`

    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Upload multiple images (admin only)
router.post('/multiple', protect, authorize('admin', 'super-admin'), uploadMultiple, (req, res) => {
  try {
    const files = []
    
    if (req.files.images) {
      req.files.images.forEach(file => {
        files.push({
          url: `/uploads/images/${file.filename}`,
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        })
      })
    }
    
    if (req.files.image && req.files.image[0]) {
      const file = req.files.image[0]
      files.push({
        url: `/uploads/image/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      })
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    res.json({
      success: true,
      count: files.length,
      data: files
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
