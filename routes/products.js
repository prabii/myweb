import express from 'express'
import Product from '../models/Product.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 1000 } = req.query
    
    const query = { active: true }
    
    if (category && category !== 'all-products' && category !== 'all') {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (search) {
      query.$text = { $search: search }
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit) > 1000 ? 1000 : parseInt(limit)
    
    const products = await Product.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
    
    const total = await Product.countDocuments(query)
    
    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    
    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create product (admin only)
router.post('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const product = await Product.create(req.body)
    
    res.status(201).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Update product (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Delete product (admin only)
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
