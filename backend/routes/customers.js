import express from 'express'
import Customer from '../models/Customer.js'
import Order from '../models/Order.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get all customers (admin only)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query
    const query = {}
    
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
    
    const total = await Customer.countDocuments(query)
    
    res.json({
      success: true,
      count: customers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: customers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single customer (admin only)
router.get('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }

    // Get customer orders
    const orders = await Order.find({ 'customer.email': customer.email })
      .sort({ createdAt: -1 })
      .limit(10)
    
    res.json({
      success: true,
      data: {
        ...customer.toObject(),
        recentOrders: orders
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get customer by email (admin only)
router.get('/email/:email', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email.toLowerCase() })
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }

    // Get customer orders
    const orders = await Order.find({ 'customer.email': customer.email })
      .sort({ createdAt: -1 })
    
    res.json({
      success: true,
      data: {
        ...customer.toObject(),
        orders
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update customer (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      })
    }
    
    res.json({
      success: true,
      data: customer
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Get customer statistics (admin only)
router.get('/stats/overview', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments()
    const customersWithOrders = await Customer.countDocuments({ totalOrders: { $gt: 0 } })
    const newCustomersToday = await Customer.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })

    const topCustomers = await Customer.find()
      .sort({ totalSpent: -1 })
      .limit(10)
      .select('email name totalOrders totalSpent')

    res.json({
      success: true,
      data: {
        totalCustomers,
        customersWithOrders,
        newCustomersToday,
        topCustomers
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
