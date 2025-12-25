import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const router = express.Router()

// Initialize Razorpay with test credentials
// Replace these with your actual Razorpay credentials from dashboard
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ''

if (!RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET === 'YOUR_RAZORPAY_KEY_SECRET' || RAZORPAY_KEY_SECRET === '') {
  console.warn('⚠️  WARNING: Razorpay Key Secret not configured!')
  console.warn('Please set RAZORPAY_KEY_SECRET in your .env file')
  console.warn('Get your credentials from: https://dashboard.razorpay.com/app/keys')
}

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET || 'dummy_secret_for_initialization'
})

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      })
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100)

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error)
    
    // Provide helpful error messages
    let errorMessage = 'Failed to create order'
    let statusCode = 500
    
    if (error.statusCode === 401 || error.error?.code === 'BAD_REQUEST_ERROR') {
      statusCode = 401
      errorMessage = 'Razorpay authentication failed. Please check your API credentials in backend/.env file:\n\n' +
        '1. Set RAZORPAY_KEY_ID=rzp_test_your_key_id\n' +
        '2. Set RAZORPAY_KEY_SECRET=your_secret_key\n' +
        '3. Restart the backend server\n\n' +
        'Get your credentials from: https://dashboard.razorpay.com/app/keys'
    } else if (error.error?.description) {
      errorMessage = error.error.description
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        code: error.error?.code,
        description: error.error?.description,
        statusCode: error.statusCode
      } : undefined
    })
  }
})

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details'
      })
    }

    // Create signature string
    const text = `${orderId}|${paymentId}`
    const secret = process.env.RAZORPAY_KEY_SECRET || ''
    
    if (!secret || secret === 'YOUR_RAZORPAY_KEY_SECRET') {
      return res.status(500).json({
        success: false,
        message: 'Razorpay Key Secret not configured. Please set RAZORPAY_KEY_SECRET in backend/.env file'
      })
    }
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex')

    const isValid = generatedSignature === signature

    if (isValid) {
      // Fetch payment details from Razorpay API
      try {
        const payment = await razorpay.payments.fetch(paymentId)
        
        res.json({
          success: true,
          message: 'Payment verified successfully',
          data: {
            paymentId: payment.id,
            orderId: payment.order_id,
            amount: payment.amount / 100, // Convert from paise to rupees
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            createdAt: payment.created_at,
            captured: payment.captured,
            description: payment.description
          }
        })
      } catch (fetchError) {
        // If fetch fails, still return success if signature is valid
        res.json({
          success: true,
          message: 'Payment verified successfully (signature valid)',
          data: {
            paymentId,
            orderId,
            signature
          }
        })
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    })
  }
})

// Get payment details by payment ID (using Razorpay Payments API)
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required'
      })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || ''
    
    if (!secret || secret === 'YOUR_RAZORPAY_KEY_SECRET') {
      return res.status(500).json({
        success: false,
        message: 'Razorpay Key Secret not configured. Please set RAZORPAY_KEY_SECRET in backend/.env file'
      })
    }

    // Fetch payment details from Razorpay API
    const payment = await razorpay.payments.fetch(paymentId)

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        createdAt: payment.created_at,
        captured: payment.captured,
        description: payment.description,
        email: payment.email,
        contact: payment.contact,
        notes: payment.notes,
        fee: payment.fee ? payment.fee / 100 : 0,
        tax: payment.tax ? payment.tax / 100 : 0
      }
    })
  } catch (error) {
    console.error('Fetch payment error:', error)
    
    let errorMessage = 'Failed to fetch payment details'
    if (error.statusCode === 404) {
      errorMessage = 'Payment not found'
    } else if (error.error?.description) {
      errorMessage = error.error.description
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: errorMessage
    })
  }
})

// Get all payments for an order
router.get('/order/:orderId/payments', async (req, res) => {
  try {
    const { orderId } = req.params

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || ''
    
    if (!secret || secret === 'YOUR_RAZORPAY_KEY_SECRET') {
      return res.status(500).json({
        success: false,
        message: 'Razorpay Key Secret not configured. Please set RAZORPAY_KEY_SECRET in backend/.env file'
      })
    }

    // Fetch payments for the order
    const payments = await razorpay.orders.fetchPayments(orderId)

    res.json({
      success: true,
      count: payments.items.length,
      data: payments.items.map(payment => ({
        paymentId: payment.id,
        orderId: payment.order_id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        createdAt: payment.created_at,
        captured: payment.captured
      }))
    })
  } catch (error) {
    console.error('Fetch order payments error:', error)
    
    let errorMessage = 'Failed to fetch payments for order'
    if (error.statusCode === 404) {
      errorMessage = 'Order not found'
    } else if (error.error?.description) {
      errorMessage = error.error.description
    } else if (error.message) {
      errorMessage = error.message
    }
    
    res.status(error.statusCode || 500).json({
      success: false,
      message: errorMessage
    })
  }
})

export default router
