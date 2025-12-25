import express from 'express'
import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Get all orders (admin only)
router.get('/', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query
    const query = {}
    
    if (status) {
      query.status = status
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
    
    const total = await Order.countDocuments(query)
    
    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single order (admin only)
router.get('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    
    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update order status (admin only)
router.put('/:id/status', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const { status, notes } = req.body
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      })
    }

    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'in-transit', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    const order = await Order.findById(req.params.id)
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Add to status history
    order.statusHistory.push({
      status: order.status,
      updatedAt: new Date(),
      updatedBy: req.admin?.email || 'admin'
    })

    order.status = status
    if (notes) {
      order.notes = notes
    }

    await order.save()
    
    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update order (admin only)
router.put('/:id', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }
    
    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Get customer orders by email (public - for customer profile)
router.get('/customer/:email', async (req, res) => {
  try {
    const { email } = req.params
    const orders = await Order.find({ 'customer.email': email.toLowerCase() })
      .sort({ createdAt: -1 })
      .limit(100)
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create order (public - from checkout)
router.post('/', async (req, res) => {
  try {
    const orderData = req.body

    // Create or update customer
    if (orderData.customer?.email) {
      await Customer.findOneAndUpdate(
        { email: orderData.customer.email.toLowerCase() },
        {
          $set: {
            name: orderData.customer.name,
            phone: orderData.customer.phone,
            lastOrderDate: new Date()
          },
          $inc: {
            totalOrders: 1,
            totalSpent: orderData.amount || 0
          }
        },
        { upsert: true, new: true }
      )
    }

    const order = await Order.create(orderData)
    
    res.status(201).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Get order statistics (admin only)
router.get('/stats/overview', protect, authorize('admin', 'super-admin'), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ status: 'pending' })
    const processingOrders = await Order.countDocuments({ status: 'processing' })
    const shippedOrders = await Order.countDocuments({ status: 'shipped' })
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' })
    
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: { $ne: 'cancelled' }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0
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
