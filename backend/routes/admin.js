import express from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', {
    expiresIn: '30d'
  })
}

// Admin Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Admin login attempt:', { email: req.body.email })
    
    const { email, password } = req.body

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    // Find admin with password field (password is excluded by default)
    const admin = await Admin.findOne({ email }).select('+password')
    
    if (!admin) {
      console.log('❌ Admin not found:', email)
      console.log('💡 Run: node scripts/createAdmin.js to create admin')
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Admin not found. Run: node scripts/createAdmin.js'
      })
    }

    if (!admin.active) {
      console.log('❌ Admin account inactive:', email)
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      })
    }

    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      console.log('❌ Password mismatch for:', email)
      console.log('💡 Expected password for admin@mechheaven.com: admin123')
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Check email and password.'
      })
    }

    // Update last login
    admin.lastLogin = new Date()
    await admin.save()

    const token = generateToken(admin._id)

    console.log('✅ Admin login successful:', email)

    res.json({
      success: true,
      token,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('❌ Admin login error:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get current admin
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password')
    
    res.json({
      success: true,
      data: admin
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create admin (super-admin only)
router.post('/create', protect, authorize('super-admin'), async (req, res) => {
  try {
    const admin = await Admin.create(req.body)
    
    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

// Get all admins (super-admin only)
router.get('/all', protect, authorize('super-admin'), async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 })
    
    res.json({
      success: true,
      count: admins.length,
      data: admins
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
