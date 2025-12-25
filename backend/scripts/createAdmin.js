import mongoose from 'mongoose'
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

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const adminData = {
      email: process.env.ADMIN_EMAIL || 'admin@mechheaven.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Super Admin',
      role: 'super-admin',
      active: true
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email })
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', adminData.email)
      console.log('')
      console.log('To reset password, delete and recreate:')
      console.log('1. Delete existing admin from MongoDB')
      console.log('2. Run this script again')
      console.log('')
      console.log('Or check admin details:')
      console.log('   Run: node scripts/checkAdmin.js')
      process.exit(0)
    }

    const admin = await Admin.create(adminData)
    console.log('✅ Admin created successfully!')
    console.log('')
    console.log('📧 Login Credentials:')
    console.log('   Email:', admin.email)
    console.log('   Password:', adminData.password)
    console.log('   Role:', admin.role)
    console.log('')
    console.log('🔗 Admin Dashboard: http://localhost:5173/admin')
    console.log('')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
