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

const checkAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    console.log('')

    // Check all admins
    const admins = await Admin.find().select('-password')
    
    if (admins.length === 0) {
      console.log('❌ No admin users found!')
      console.log('')
      console.log('💡 Create admin by running:')
      console.log('   node scripts/createAdmin.js')
      process.exit(1)
    }

    console.log(`✅ Found ${admins.length} admin user(s):`)
    console.log('')
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`)
      console.log(`   Name: ${admin.name}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Active: ${admin.active ? '✅' : '❌'}`)
      console.log(`   Created: ${admin.createdAt}`)
      console.log(`   Last Login: ${admin.lastLogin || 'Never'}`)
      console.log('')
    })

    // Check default admin
    const defaultAdmin = await Admin.findOne({ email: 'admin@mechheaven.com' })
    if (defaultAdmin) {
      console.log('✅ Default admin exists: admin@mechheaven.com')
      console.log('   Password: admin123')
    } else {
      console.log('⚠️  Default admin (admin@mechheaven.com) not found')
      console.log('   Run: node scripts/createAdmin.js')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkAdmin()
