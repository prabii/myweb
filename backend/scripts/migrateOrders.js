import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import dotenv from 'dotenv'

dotenv.config()

// MongoDB Connection
const DB_USERNAME = 'DB_ECOM'
const DB_PASSWORD = encodeURIComponent('prabhas@123$')
const DB_CLUSTER = 'ecom.cl9lzmi.mongodb.net'
const DB_NAME = 'mechheaven'

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority`

const migrateOrders = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // This script is meant to be run manually with orders data
    // You can pass orders as JSON or read from a file
    console.log('\n📋 Order Migration Script')
    console.log('This script helps migrate orders from localStorage to MongoDB')
    console.log('\nTo use this script:')
    console.log('1. Export orders from localStorage (JSON format)')
    console.log('2. Create a file with orders array')
    console.log('3. Import and run this script with the orders data')
    console.log('\nExample orders format:')
    console.log(JSON.stringify({
      orderId: 'ORDER_1234567890_abc123',
      paymentMethod: 'cod',
      subtotal: 1000,
      discount: 100,
      coupon: 'SAVE10',
      amount: 900,
      items: [{
        id: 'product_id',
        name: 'Product Name',
        price: 500,
        quantity: 2,
        image: 'image_url'
      }],
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'City',
        state: 'State',
        pincode: '123456'
      },
      paymentDetails: null,
      status: 'pending',
      date: new Date().toISOString()
    }, null, 2))

    // Example: If you have orders array, uncomment and modify:
    /*
    const ordersToMigrate = [
      // ... your orders array here
    ]

    let migrated = 0
    let skipped = 0

    for (const orderData of ordersToMigrate) {
      try {
        // Check if order already exists
        const existingOrder = await Order.findOne({ orderId: orderData.orderId })
        if (existingOrder) {
          console.log(`⏭️  Skipping order ${orderData.orderId} - already exists`)
          skipped++
          continue
        }

        // Create or update customer
        if (orderData.customer?.email) {
          await Customer.findOneAndUpdate(
            { email: orderData.customer.email.toLowerCase() },
            {
              $set: {
                name: orderData.customer.name,
                phone: orderData.customer.phone,
                lastOrderDate: new Date(orderData.date || Date.now())
              },
              $inc: {
                totalOrders: 1,
                totalSpent: orderData.amount || 0
              }
            },
            { upsert: true, new: true }
          )
        }

        // Create order
        await Order.create({
          orderId: orderData.orderId,
          customer: orderData.customer,
          items: orderData.items || [],
          subtotal: orderData.subtotal || 0,
          discount: orderData.discount || 0,
          coupon: orderData.coupon || null,
          amount: orderData.amount || 0,
          paymentMethod: orderData.paymentMethod || 'cod',
          paymentDetails: orderData.paymentDetails || null,
          status: orderData.status || 'pending',
          createdAt: new Date(orderData.date || Date.now())
        })

        migrated++
        console.log(`✅ Migrated order ${orderData.orderId}`)
      } catch (error) {
        console.error(`❌ Error migrating order ${orderData.orderId}:`, error.message)
      }
    }

    console.log(`\n📊 Migration Summary:`)
    console.log(`   ✅ Migrated: ${migrated}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    */

    await mongoose.disconnect()
    console.log('\n✅ Migration script completed')
  } catch (error) {
    console.error('❌ Migration error:', error)
    process.exit(1)
  }
}

migrateOrders()
