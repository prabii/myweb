// Razorpay Payment Integration Library
// Core Razorpay utilities for payment processing

const API_URL = 'https://myweb-hyh3.onrender.com/api'
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'

/**
 * Loads the Razorpay checkout script dynamically
 * @returns {Promise<boolean>} True if script loaded successfully
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true)
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Creates a Razorpay order on the backend
 * @param {number} amount - Amount in rupees
 * @param {string} currency - Currency code (default: 'INR')
 * @param {string} receipt - Receipt identifier
 * @returns {Promise<Object>} Order data with orderId
 */
export const createRazorpayOrder = async (amount, currency = 'INR', receipt = null) => {
  try {
    console.log('Creating order with backend:', `${API_URL}/payments/create-order`)
    
    const response = await fetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: receipt || `receipt_${Date.now()}`
      })
    })

    console.log('Order creation response status:', response.status)

    const orderData = await response.json()
    console.log('Order creation response:', orderData)

    if (!response.ok) {
      // Handle HTTP errors
      if (response.status === 401) {
        throw new Error('Razorpay authentication failed. Please configure RAZORPAY_KEY_SECRET in backend/.env file. Check RAZORPAY_CREDENTIALS_SETUP.md for instructions.')
      }
      throw new Error(orderData.message || `Failed to create order (${response.status})`)
    }

    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order')
    }

    return {
      success: true,
      orderId: orderData.data.orderId,
      amount: orderData.data.amount,
      currency: orderData.data.currency
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to backend server. Please check your API endpoint configuration.')
    }
    
    throw new Error(error.message || 'Failed to create order')
  }
}

/**
 * Verifies payment signature on the backend
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Payment signature
 * @returns {Promise<Object>} Verification result with payment details
 */
export const verifyPayment = async (orderId, paymentId, signature) => {
  try {
    const response = await fetch(`${API_URL}/payments/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature
      })
    })

    const verifyData = await response.json()

    if (!verifyData.success) {
      throw new Error(verifyData.message || 'Payment verification failed')
    }

    return {
      success: true,
      paymentDetails: verifyData.data || null
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw new Error(error.message || 'Payment verification failed')
  }
}

/**
 * Initializes and opens the Razorpay payment modal using Razorpay's default API
 * This matches Razorpay's standard integration pattern
 * @param {Object} options - Razorpay payment options (direct Razorpay API options)
 * @param {Function} onSuccess - Success callback function(response)
 * @param {Function} onError - Error callback function(error)
 */
export const initializeRazorpayPayment = async (options, onSuccess, onError) => {
  // Load Razorpay script
  const razorpayLoaded = await loadRazorpayScript()
  
  if (!razorpayLoaded) {
    const error = 'Razorpay SDK failed to load. Please check your internet connection.'
    if (onError) onError({ error })
    throw new Error(error)
  }
  
  if (!window.Razorpay) {
    const error = 'Razorpay is not available. Please refresh the page.'
    if (onError) onError({ error })
    throw new Error(error)
  }

  // Ensure amount is in paise if not already
  if (options.amount && options.amount < 1000) {
    options.amount = Math.round(options.amount * 100)
  }

  // Set default key if not provided
  if (!options.key) {
    options.key = RAZORPAY_KEY_ID
  }

  // Create Razorpay instance with options
  const razorpay = new window.Razorpay(options)
  
  // Handle payment success
  razorpay.on('payment.success', function (response) {
    console.log('Payment successful:', response)
    if (onSuccess) {
      onSuccess(response)
    }
  })
  
  // Handle payment errors
  razorpay.on('payment.error', function (error) {
    console.error('Payment error:', error)
    const errorMessage = error.error?.description || 'Payment failed. Please try again.'
    if (onError) {
      onError({ error: errorMessage, message: errorMessage })
    }
  })
  
  // Open Razorpay payment modal
  razorpay.open()
  console.log('Razorpay modal opened')
}

/**
 * Complete payment flow: Create order -> Initialize payment -> Verify
 * @param {Object} config - Payment configuration
 * @param {number} config.amount - Amount in rupees
 * @param {Object} config.customerDetails - Customer information
 * @param {string} config.selectedMethod - Selected payment method
 * @returns {Promise<Object>} Payment result
 */
export const processRazorpayPayment = async ({
  amount,
  customerDetails = {},
  selectedMethod = null
}) => {
  try {
    console.log('=== Starting Razorpay Payment Process ===')
    console.log('Amount:', amount)
    console.log('Selected Method:', selectedMethod)
    console.log('Customer:', customerDetails.email)
    
    // Step 1: Create order
    console.log('Step 1: Creating order...')
    const order = await createRazorpayOrder(amount)
    
    if (!order || !order.success) {
      throw new Error('Failed to create order')
    }

    console.log('✅ Order created:', order.orderId)

    // Step 2: Initialize and open payment modal
    console.log('Step 2: Initializing payment modal...')
    const paymentResult = await initializeRazorpayPayment({
      orderId: order.orderId,
      amount: amount,
      customerDetails,
      selectedMethod
    })

    console.log('✅ Payment modal initialized')
    return paymentResult
  } catch (error) {
    console.error('❌ Payment process failed:', error)
    const errorMessage = error?.message || error?.error || 'Failed to process payment'
    
    // Provide helpful error messages
    if (errorMessage.includes('Authentication failed') || errorMessage.includes('401')) {
      throw {
        success: false,
        error: 'Razorpay authentication failed. Please check backend configuration (RAZORPAY_KEY_SECRET in backend/.env)'
      }
    }
    
    throw {
      success: false,
      error: errorMessage
    }
  }
}

export default {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyPayment,
  initializeRazorpayPayment,
  processRazorpayPayment
}
