import express from 'express'
import Coupon from '../models/Coupon.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Validate coupon (public)
router.post('/validate', async (req, res) => {
  try {
    const { code, totalAmount } = req.body
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      })
    }
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      })
    }
    
    const validation = coupon.isValid(totalAmount || 0)
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      })
    }
    
    const discount = coupon.calculateDiscount(totalAmount || 0)
    
    res.json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          description: coupon.description
        },
        discount,
        finalAmount: (totalAmount || 0) - discount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Apply coupon (public) - increments usage count
router.post('/apply', async (req, res) => {
  try {
    const { code, totalAmount } = req.body
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() })
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      })
    }
    
    const validation = coupon.isValid(totalAmount || 0)
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      })
    }
    
    // Increment usage count
    coupon.usedCount += 1
    await coupon.save()
    
    const discount = coupon.calculateDiscount(totalAmount || 0)
    
    res.json({
      success: true,
      data: {
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discount,
        finalAmount: (totalAmount || 0) - discount
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get all coupons (admin only)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    
    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single coupon (admin only)
router.get('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }
    
    res.json({
      success: true,
      data: coupon
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create coupon (admin only)
router.post('/create', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body)
    
    res.status(201).json({
      success: true,
      data: coupon
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Update coupon (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }
    
    res.json({
      success: true,
      data: coupon
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Delete coupon (admin only)
router.delete('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
