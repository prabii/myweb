import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// URL encode password to handle special characters (@ and $)
const DB_USERNAME = 'DB_ECOM'
const DB_PASSWORD = encodeURIComponent('prabhas@123$')
const DB_CLUSTER = 'ecom.cl9lzmi.mongodb.net'
const DB_NAME = 'mechheaven'

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    console.error('💡 Troubleshooting:')
    console.error('   1. Check MongoDB Atlas IP whitelist (allow all IPs: 0.0.0.0/0)')
    console.error('   2. Verify username and password are correct')
    console.error('   3. Check database name matches in Atlas')
    console.error('   4. Ensure network access is enabled in Atlas')
    process.exit(1)
  }
}

export default connectDB
