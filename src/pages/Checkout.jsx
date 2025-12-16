import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { processRazorpayPayment } from '../utils/razorpay'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const totalAmount = getCartTotal()

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some products to checkout</p>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!customerDetails.name.trim()) {
      alert('Please enter your name')
      return false
    }
    if (!customerDetails.email.trim() || !customerDetails.email.includes('@')) {
      alert('Please enter a valid email address')
      return false
    }
    if (!customerDetails.phone.trim() || customerDetails.phone.length < 10) {
      alert('Please enter a valid phone number')
      return false
    }
    if (!customerDetails.address.trim()) {
      alert('Please enter your address')
      return false
    }
    if (!customerDetails.city.trim()) {
      alert('Please enter your city')
      return false
    }
    if (!customerDetails.pincode.trim() || customerDetails.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode')
      return false
    }
    return true
  }

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const orderData = {
        items: cartItems,
        total: totalAmount,
        customer: customerDetails
      }

      const result = await processRazorpayPayment(totalAmount, orderData, customerDetails)
      
      if (result.success) {
        // Payment successful
        handleOrderSuccess('razorpay', result)
      }
    } catch (error) {
      alert(error.error || 'Payment failed. Please try again.')
      setLoading(false)
    }
  }

  const handleCODOrder = () => {
    if (!validateForm()) return

    setLoading(true)
    
    // Simulate COD order processing
    setTimeout(() => {
      handleOrderSuccess('cod', {
        orderId: `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
    }, 1000)
  }

  const handleOrderSuccess = (method, paymentData) => {
    const orderDetails = {
      orderId: paymentData.orderId || `ORDER_${Date.now()}`,
      paymentMethod: method,
      amount: totalAmount,
      items: cartItems,
      customer: customerDetails,
      date: new Date().toISOString()
    }

    // Save order to localStorage (in production, send to backend)
    const orders = JSON.parse(localStorage.getItem('mechheaven_orders') || '[]')
    orders.push(orderDetails)
    localStorage.setItem('mechheaven_orders', JSON.stringify(orders))

    // Clear cart
    clearCart()
    
    setOrderPlaced(true)
    setLoading(false)
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      navigate(`/order-success/${orderDetails.orderId}`)
    }, 2000)
  }

  const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment()
    } else if (paymentMethod === 'cod') {
      handleCODOrder()
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout">
        <div className="checkout-container">
          <div className="order-success-message">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Redirecting to order confirmation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Shipping Details</h2>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={customerDetails.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customerDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={customerDetails.address}
                onChange={handleInputChange}
                placeholder="Enter your complete address"
                rows="3"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={customerDetails.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={customerDetails.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={customerDetails.pincode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                required
              />
            </div>

            <h2 className="payment-method-title">Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💳</span>
                  <div>
                    <strong>Online Payment (Razorpay)</strong>
                    <p>Pay securely with Razorpay</p>
                  </div>
                </div>
              </label>
              
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <span className="payment-icon">💰</span>
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <p>Pay when you receive the order</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
            </button>
            
            <button 
              className="back-to-cart-btn"
              onClick={() => navigate('/cart')}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

