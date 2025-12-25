import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Section from '../models/Section.js'
import Coupon from '../models/Coupon.js'
import Admin from '../models/Admin.js'
import dotenv from 'dotenv'

dotenv.config()

// URL encode password to handle special characters (@ and $)
const DB_USERNAME = 'DB_ECOM'
const DB_PASSWORD = encodeURIComponent('prabhas@123$')
const DB_CLUSTER = 'ecom.cl9lzmi.mongodb.net'
const DB_NAME = 'mechheaven'

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Create default admin if not exists
    const adminExists = await Admin.findOne({ email: 'admin@mechheaven.com' })
    if (!adminExists) {
      await Admin.create({
        email: 'admin@mechheaven.com',
        password: 'admin123',
        name: 'Super Admin',
        role: 'super-admin',
        active: true
      })
      console.log('✅ Default admin created')
    }

    // Create sample coupon
    const couponExists = await Coupon.findOne({ code: 'WELCOME20' })
    if (!couponExists) {
      await Coupon.create({
        code: 'WELCOME20',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 20,
        minPurchase: 1000,
        maxDiscount: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        usageLimit: null,
        active: true
      })
      console.log('✅ Sample coupon created')
    }

    console.log('✅ Seed data completed')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

seedData()
