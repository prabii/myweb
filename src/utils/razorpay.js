// Razorpay Payment Integration
// Replace 'YOUR_RAZORPAY_KEY_ID' with your actual Razorpay Key ID from dashboard
// Get your Key ID from: https://dashboard.razorpay.com/app/keys

export const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID' // Replace with your Razorpay Key ID

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

export const processRazorpayPayment = async (amount, orderData, customerDetails) => {
  const razorpayLoaded = await loadRazorpayScript()
  
  if (!razorpayLoaded) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.')
  }

  if (RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID') {
    // For demo/testing without backend - creates a test payment
    alert('Please configure your Razorpay Key ID in src/utils/razorpay.js\n\nFor production, you need a backend server to create orders securely.')
    
    // Simulate payment for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: `pay_test_${Date.now()}`,
          orderId: `order_test_${Date.now()}`,
          signature: 'test_signature'
        })
      }, 1500)
    })
  }

  // Generate a unique order ID
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100), // Amount in paise (multiply by 100)
    currency: 'INR',
    name: 'MechHeaven',
    description: `Order #${orderId}`,
    order_id: orderId, // In production, get this from your backend API
    handler: function (response) {
      // This will be handled by the promise resolve
      return response
    },
    prefill: {
      name: customerDetails.name || '',
      email: customerDetails.email || '',
      contact: customerDetails.phone || ''
    },
    theme: {
      color: '#d4af37'
    },
    modal: {
      ondismiss: function() {
        // User closed the payment modal
        return false
      }
    }
  }
  
  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay(options)
    
    razorpay.on('payment.success', function (response) {
      resolve({
        success: true,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature
      })
    })
    
    razorpay.on('payment.error', function (error) {
      reject({
        success: false,
        error: error.error?.description || 'Payment failed. Please try again.'
      })
    })
    
    razorpay.open()
  })
}

