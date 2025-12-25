import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Import Routes
import productRoutes from './routes/products.js'
import sectionRoutes from './routes/sections.js'
import couponRoutes from './routes/coupons.js'
import categoryRoutes from './routes/categories.js'
import paymentRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'
import uploadRoutes from './routes/upload.js'
import orderRoutes from './routes/orders.js'
import customerRoutes from './routes/customers.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
// CORS Configuration - Allow all origins in development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'https://ecom-azure-phi.vercel.app',
      'https://myweb-seven-chi.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
    next()
  })
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// MongoDB Connection
// Use environment variable or fallback to default (for development only)
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://DB_ECOM:${encodeURIComponent('prabhas@123$')}@ecom.cl9lzmi.mongodb.net/mechheaven?retryWrites=true&w=majority`

if (!process.env.MONGODB_URI) {
  console.warn('⚠️  Warning: Using default MongoDB connection. Set MONGODB_URI in .env file for production!')
}

console.log('🔌 Connecting to MongoDB...')
if (process.env.MONGODB_URI) {
  // Extract info from connection string if using env variable
  try {
    const url = new URL(process.env.MONGODB_URI.replace('mongodb+srv://', 'https://'))
    console.log(`   Database: ${url.pathname.split('/')[1] || 'mechheaven'}`)
    console.log(`   User: ${url.username || 'DB_ECOM'}`)
  } catch (e) {
    console.log('   Using MongoDB Atlas connection')
  }
} else {
  console.log(`   Cluster: ecom.cl9lzmi.mongodb.net`)
  console.log(`   Database: mechheaven`)
  console.log(`   User: DB_ECOM`)
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!')
  console.log(`📊 Database: ${mongoose.connection.name}`)
  console.log(`🌐 Host: ${mongoose.connection.host}`)
  console.log(`🔗 Ready to accept connections`)
})
.catch(async (error) => {
  console.error('\n❌ MongoDB Connection Failed!')
  console.error(`Error: ${error.message}`)
  
  // Try to provide more specific error information
  if (error.message.includes('authentication') || error.message.includes('bad auth')) {
    console.error('\n🔐 AUTHENTICATION ERROR')
    console.error('This means MongoDB Atlas rejected your username/password.')
    console.error('')
    console.error('🔧 IMMEDIATE FIXES:')
    console.error('')
    console.error('1. VERIFY DATABASE USER CREDENTIALS:')
    console.error('   → Go to: https://cloud.mongodb.com/')
    console.error('   → Click "Database Access" (left sidebar)')
    console.error('   → Find user: naceje6549_db_user')
    console.error('   → Click "Edit" button')
    console.error('   → Check if password is: ik1ishIQwptedpT2')
    console.error('   → If different, either:')
    console.error('      a) Update password in Atlas to match')
    console.error('      b) OR update connection string in server.js')
    console.error('')
    console.error('2. CHECK USER PERMISSIONS:')
    console.error('   → In "Database Access", edit the user')
    console.error('   → Under "Database User Privileges", select:')
    console.error('      "Read and write to any database"')
    console.error('   → OR "Atlas admin" (for full access)')
    console.error('   → Click "Update User"')
    console.error('')
    console.error('3. WHITELIST IP ADDRESS (CRITICAL!):')
    console.error('   → Go to "Network Access" (left sidebar)')
    console.error('   → Click "Add IP Address" button')
    console.error('   → Click "Allow Access from Anywhere"')
    console.error('   → This adds: 0.0.0.0/0')
    console.error('   → Click "Confirm"')
    console.error('   → ⏰ Wait 2-3 minutes for changes to apply')
    console.error('')
    console.error('4. TEST CONNECTION:')
    console.error('   → Run: node test-connection.js')
    console.error('   → This will test auth and show available databases')
  } else if (error.message.includes('timeout')) {
    console.error('\n⏱️ CONNECTION TIMEOUT')
    console.error('   → Check your internet connection')
    console.error('   → Verify MongoDB Atlas cluster is running')
    console.error('   → Check if firewall is blocking connections')
  } else {
    console.error('\n❓ UNKNOWN ERROR')
    console.error('   → Check MongoDB Atlas dashboard')
    console.error('   → Verify cluster status is "Running"')
    console.error('   → Try running: node test-connection.js')
  }
  
  console.error('\n📖 Detailed guide: backend/MONGODB_TROUBLESHOOTING.md')
  process.exit(1)
})

// Routes
app.use('/api/products', productRoutes)
app.use('/api/sections', sectionRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MechHeaven API is running',
    timestamp: new Date().toISOString()
  })
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 API URL: http://localhost:${PORT}/api`)
})
