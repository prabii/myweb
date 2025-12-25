import express from 'express'
import Section from '../models/Section.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get all sections (public)
router.get('/', async (req, res) => {
  try {
    const { type, active } = req.query
    
    const query = {}
    
    if (active !== undefined) {
      query.active = active === 'true'
    }
    
    if (type) {
      query.type = type
    }
    
    const sections = await Section.find(query).sort({ position: 1 })
    
    res.json({
      success: true,
      count: sections.length,
      data: sections
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single section (public)
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      })
    }
    
    res.json({
      success: true,
      data: section
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create section (admin only)
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const section = await Section.create(req.body)
    
    res.status(201).json({
      success: true,
      data: section
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Update section (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      })
    }
    
    res.json({
      success: true,
      data: section
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Delete section (admin only)
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id)
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Section deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
