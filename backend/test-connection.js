import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

// Test MongoDB Connection with different approaches
const DB_USERNAME = 'DB_ECOM'
const DB_PASSWORD = encodeURIComponent('prabhas@123$')
const DB_CLUSTER = 'ecom.cl9lzmi.mongodb.net'

console.log('🔍 Testing MongoDB Connection...')
console.log('Cluster:', DB_CLUSTER)
console.log('Username:', DB_USERNAME)
console.log('')

// Try connecting without database name first (to test auth)
const testAuthURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/?retryWrites=true&w=majority`

console.log('1️⃣ Testing authentication (no database)...')
mongoose.connect(testAuthURI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Authentication successful!')
  console.log('')
  
  // List all databases
  const adminDb = mongoose.connection.db.admin()
  const { databases } = await adminDb.listDatabases()
  
  console.log('📋 Available Databases:')
  databases.forEach(db => {
    const sizeMB = db.sizeOnDisk ? (db.sizeOnDisk / 1024 / 1024).toFixed(2) : '0'
    console.log(`   ✓ ${db.name} (${sizeMB} MB)`)
  })
  
  console.log('')
  
  // Try connecting to mechheaven database
  console.log('2️⃣ Testing connection to "mechheaven" database...')
  await mongoose.connection.close()
  
  const mechheavenURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/mechheaven?retryWrites=true&w=majority`
  
  await mongoose.connect(mechheavenURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  
  console.log('✅ Connected to "mechheaven" database!')
  console.log('📊 Database:', mongoose.connection.name)
  console.log('🌐 Host:', mongoose.connection.host)
  
  // List collections
  const collections = await mongoose.connection.db.listCollections().toArray()
  console.log('\n📁 Collections:')
  if (collections.length === 0) {
    console.log('   (No collections - database is empty, ready for use!)')
  } else {
    collections.forEach(col => {
      console.log(`   - ${col.name}`)
    })
  }
  
  console.log('\n✅ All tests passed! Your MongoDB connection is working.')
  console.log('💡 You can now start your server with: npm run dev')
  
  process.exit(0)
})
.catch((error) => {
  console.error('\n❌ Connection Failed!')
  console.error('Error:', error.message)
  console.error('')
  
  if (error.message.includes('authentication')) {
    console.error('🔐 AUTHENTICATION ERROR DETECTED!')
    console.error('')
    console.error('Possible causes:')
    console.error('   1. ❌ Wrong username or password')
    console.error('   2. ❌ IP address not whitelisted')
    console.error('   3. ❌ User doesn\'t have database permissions')
    console.error('')
    console.error('🔧 FIX STEPS:')
    console.error('')
    console.error('STEP 1: Check Database User')
    console.error('   → Go to: https://cloud.mongodb.com/')
    console.error('   → Click "Database Access"')
    console.error('   → Find user: naceje6549_db_user')
    console.error('   → Click "Edit"')
    console.error('   → Verify password matches: ik1ishIQwptedpT2')
    console.error('   → If wrong, update password or create new user')
    console.error('')
    console.error('STEP 2: Whitelist IP Address')
    console.error('   → Go to "Network Access"')
    console.error('   → Click "Add IP Address"')
    console.error('   → Click "Allow Access from Anywhere" (0.0.0.0/0)')
    console.error('   → Click "Confirm"')
    console.error('   → Wait 2-3 minutes')
    console.error('')
    console.error('STEP 3: Check User Permissions')
    console.error('   → In "Database Access", edit user')
    console.error('   → Set "Database User Privileges" to:')
    console.error('      "Read and write to any database"')
    console.error('   OR')
    console.error('      "Atlas admin"')
    console.error('')
  } else if (error.message.includes('timeout')) {
    console.error('⏱️ TIMEOUT ERROR')
    console.error('   → Check your internet connection')
    console.error('   → Verify MongoDB Atlas cluster is running')
    console.error('   → Check firewall settings')
  } else {
    console.error('❓ UNKNOWN ERROR')
    console.error('   → Check MongoDB Atlas status')
    console.error('   → Verify cluster is active')
  }
  
  process.exit(1)
})
