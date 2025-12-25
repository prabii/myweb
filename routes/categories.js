import express from 'express'
import Category from '../models/Category.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query
    
    const query = {}
    
    if (active !== undefined) {
      query.active = active === 'true'
    }
    
    const categories = await Category.find(query).sort({ position: 1 })
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single category (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create category (admin only)
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Generate slug from displayName if not provided
    if (!req.body.slug && req.body.displayName) {
      req.body.slug = req.body.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    // Set name from slug if not provided
    if (!req.body.name && req.body.slug) {
      req.body.name = req.body.slug
    }
    
    const category = await Category.create(req.body)
    
    res.status(201).json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Update category (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    // Generate slug from displayName if displayName is updated
    if (req.body.displayName && !req.body.slug) {
      req.body.slug = req.body.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.json({
      success: true,
      data: category
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Delete category (admin only)
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
