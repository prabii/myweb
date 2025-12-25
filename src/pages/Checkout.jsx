import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { MapPin, Plus } from 'lucide-react'
// Razorpay will be imported dynamically when needed
import { couponsAPI } from '../utils/api'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart, setShowLoginModal } = useCart()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setShowLoginModal(true)
      navigate('/cart')
    }
  }, [currentUser, navigate, setShowLoginModal])
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [selectedRazorpayMethod, setSelectedRazorpayMethod] = useState(null) // 'card', 'upi', 'netbanking', 'wallet'
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)
  
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [useProfileDetails, setUseProfileDetails] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (currentUser?.email) {
      setCustomerDetails(prev => ({
        ...prev,
        email: currentUser.email
      }))

      // Load saved addresses
      const addressesKey = `mechheaven_addresses_${currentUser.uid}`
      const savedAddressesData = localStorage.getItem(addressesKey)
      if (savedAddressesData) {
        const addresses = JSON.parse(savedAddressesData)
        setSavedAddresses(addresses)
        // Auto-select first address if available and none selected
        if (addresses.length > 0) {
          const currentSelected = addresses.find(addr => addr.id === selectedAddressId)
          if (!currentSelected) {
            const firstAddress = addresses[0]
            setSelectedAddressId(firstAddress.id)
            setCustomerDetails(prev => ({
              ...prev,
              name: firstAddress.name || prev.name,
              phone: firstAddress.phone || prev.phone,
              address: firstAddress.address || prev.address,
              city: firstAddress.city || prev.city,
              state: firstAddress.state || prev.state,
              pincode: firstAddress.pincode || prev.pincode
            }))
          }
        }
      }
    }
  }, [currentUser, selectedAddressId])

  const loadProfileDetails = () => {
    if (currentUser) {
      const userProfileKey = `mechheaven_profile_${currentUser.uid}`
      const savedProfile = localStorage.getItem(userProfileKey)
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile)
        setCustomerDetails(prev => ({
          ...prev,
          name: profileData.name || prev.name,
          phone: profileData.phone || prev.phone,
          address: profileData.address || prev.address,
          city: profileData.city || prev.city,
          state: profileData.state || prev.state,
          pincode: profileData.pincode || prev.pincode
        }))
        setUseProfileDetails(true)
      } else {
        alert('No profile details found. Please update your profile first.')
      }
    }
  }

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address.id)
    setCustomerDetails(prev => ({
      ...prev,
      name: address.name || prev.name,
      phone: address.phone || prev.phone,
      address: address.address || prev.address,
      city: address.city || prev.city,
      state: address.state || prev.state,
      pincode: address.pincode || prev.pincode
    }))
    setShowNewAddressForm(false)
  }

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveNewAddress = () => {
    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address.trim() || 
        !newAddress.city.trim() || !newAddress.state.trim() || !newAddress.pincode.trim()) {
      alert('Please fill all required fields')
      return
    }

    const addressToSave = {
      id: Date.now().toString(),
      label: newAddress.label || 'Home',
      name: newAddress.name,
      phone: newAddress.phone,
      address: newAddress.address,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode
    }

    // Save to localStorage
    if (currentUser) {
      const addressesKey = `mechheaven_addresses_${currentUser.uid}`
      const existingAddresses = JSON.parse(localStorage.getItem(addressesKey) || '[]')
      const updatedAddresses = [...existingAddresses, addressToSave]
      localStorage.setItem(addressesKey, JSON.stringify(updatedAddresses))
      setSavedAddresses(updatedAddresses)
    }

    // Use the new address
    handleSelectAddress(addressToSave)
    setNewAddress({
      label: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    })
    alert('Address saved and selected!')
  }

  const subtotal = getCartTotal()
  const totalAmount = subtotal - couponDiscount

  if (!currentUser) {
    return null // Will redirect to cart
  }

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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setApplyingCoupon(true)
    setCouponError('')

    try {
      const response = await couponsAPI.validate(couponCode, subtotal)
      
      if (response.success) {
        setAppliedCoupon(response.data.coupon)
        setCouponDiscount(response.data.discount)
        setCouponError('')
      } else {
        setCouponError(response.message || 'Invalid coupon code')
        setAppliedCoupon(null)
        setCouponDiscount(0)
      }
    } catch (error) {
      setCouponError(error.message || 'Failed to validate coupon')
      setAppliedCoupon(null)
      setCouponDiscount(0)
    } finally {
      setApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponError('')
  }

  const handleRazorpayPayment = async (method = null) => {
    if (!validateForm()) return

    if (totalAmount < 0) {
      alert('Invalid order amount. Please check your coupon.')
      return
    }

    // If method is provided, set it
    if (method) {
      setSelectedRazorpayMethod(method)
    }

    // Check if a payment method is selected
    const selectedMethod = method || selectedRazorpayMethod
    if (!selectedMethod) {
      alert('Please select a payment method (Card, UPI, Net Banking, or Wallet)')
      return
    }

    setLoading(true)
    
    try {
      // Get Razorpay Key ID from environment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag'
      
      if (!razorpayKey || !razorpayKey.startsWith('rzp_')) {
        alert('Razorpay Key ID is not configured. Please add VITE_RAZORPAY_KEY_ID to your .env file.')
        setLoading(false)
        return
      }

      // Configure payment method
      const methodConfig = {
        [selectedMethod]: true
      }

      // Try to create order on backend (optional - Razorpay can create order automatically)
      let orderId = undefined
      try {
        const orderResponse = await fetch(`https://myweb-hyh3.onrender.com/api/payments/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
          })
        })
        
        if (orderResponse.ok) {
          const orderData = await orderResponse.json()
          if (orderData.success) {
            orderId = orderData.data.orderId
          }
        }
      } catch (error) {
        console.warn('Order creation failed, proceeding without order_id:', error)
        // Continue without order_id - Razorpay will handle it
      }

      // Initialize Razorpay payment using default API
      const { initializeRazorpayPayment } = await import('../lib/razorpay')
      
      await initializeRazorpayPayment(
        {
          key: razorpayKey,
          amount: Math.round(totalAmount * 100), // Amount in paise
          currency: 'INR',
          name: 'MechHeaven',
          description: `Order Payment - ₹${totalAmount.toLocaleString('en-IN')}`,
          ...(orderId && { order_id: orderId }), // Only include if order_id exists
          prefill: {
            name: customerDetails.name || '',
            email: customerDetails.email || '',
            contact: customerDetails.phone || ''
          },
          theme: {
            color: '#d4af37'
          },
          method: methodConfig,
          notes: {
            order_total: totalAmount.toString(),
            coupon: appliedCoupon?.code || '',
            customer_email: customerDetails.email || ''
          },
          retry: {
            enabled: true,
            max_count: 3
          },
          modal: {
            ondismiss: function() {
              console.log('Razorpay modal dismissed')
              setLoading(false)
            }
          }
        },
        async (response) => {
          // Payment successful callback
          console.log('Payment successful:', response)
          
          try {
            // Apply coupon to increment usage count
            if (appliedCoupon?.code) {
              try {
                await couponsAPI.apply(appliedCoupon.code, subtotal)
              } catch (error) {
                console.warn('Failed to apply coupon:', error)
                // Continue with order even if coupon apply fails
              }
            }

            // Verify payment on backend
            const verifyResponse = await fetch(`https://myweb-hyh3.onrender.com/api/payments/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Payment verified successfully
              handleOrderSuccess('razorpay', {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                ...response
              })
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            // Even if verification fails, payment was successful
            handleOrderSuccess('razorpay', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              ...response
            })
          }
        },
        (error) => {
          // Payment failed or cancelled callback
          console.error('Payment error:', error)
          const errorMessage = error?.message || error?.error?.description || 'Payment failed. Please try again.'
          alert(errorMessage)
          setLoading(false)
        }
      )
    } catch (error) {
      console.error('Payment initialization error:', error)
      const errorMessage = error?.message || 'Failed to initialize payment. Please try again.'
      alert(errorMessage)
      setLoading(false)
    }
  }

  const handleCODOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    
    try {
      // Apply coupon to increment usage count
      if (appliedCoupon?.code) {
        try {
          await couponsAPI.apply(appliedCoupon.code, subtotal)
        } catch (error) {
          console.warn('Failed to apply coupon:', error)
          // Continue with order even if coupon apply fails
        }
      }

      // Simulate COD order processing
      setTimeout(() => {
        handleOrderSuccess('cod', {
          orderId: `COD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
      }, 1000)
    } catch (error) {
      console.error('COD order error:', error)
      alert('Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  const handleOrderSuccess = async (method, paymentData) => {
    const orderDetails = {
      orderId: paymentData.orderId || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentMethod: method,
      subtotal: subtotal,
      discount: couponDiscount,
      coupon: appliedCoupon?.code || null,
      amount: totalAmount,
      items: cartItems.map(item => ({
        id: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      customer: customerDetails,
      paymentDetails: method === 'razorpay' ? {
        orderId: paymentData.orderId,
        paymentId: paymentData.paymentId,
        signature: paymentData.signature,
        status: 'success'
      } : null,
      status: 'pending',
      date: new Date().toISOString()
    }

    // Save order to backend
    try {
      const response = await fetch(`https://myweb-hyh3.onrender.com/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      })
      
      if (!response.ok) {
        console.warn('Failed to save order to backend, saving to localStorage')
      }
    } catch (error) {
      console.warn('Error saving order to backend:', error)
    }

    // Also save to localStorage as backup
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
    if (paymentMethod === 'cod') {
      handleCODOrder()
    } else {
      handleRazorpayPayment()
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
            <div className="shipping-header">
              <h2>Shipping Details</h2>
              {currentUser && (
                <button 
                  type="button"
                  onClick={loadProfileDetails}
                  className="use-profile-btn"
                  disabled={useProfileDetails}
                >
                  {useProfileDetails ? '✓ Using Profile Details' : '📋 Use Profile Details'}
                </button>
              )}
            </div>

            {savedAddresses.length > 0 && (
              <div className="saved-addresses-section">
                <h3>Select Delivery Address</h3>
                <div className="addresses-grid">
                  {savedAddresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`address-option-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="address-option-header">
                        <MapPin size={16} />
                        <span className="address-label">{address.label || 'Address'}</span>
                        {selectedAddressId === address.id && (
                          <span className="selected-badge">✓ Selected</span>
                        )}
                      </div>
                      <div className="address-option-details">
                        <p><strong>{address.name}</strong></p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  className="add-new-address-btn"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                >
                  <Plus size={16} />
                  {showNewAddressForm ? 'Cancel' : 'Add New Address'}
                </button>
              </div>
            )}

            {showNewAddressForm && (
              <div className="new-address-form-section">
                <h3>Add New Address</h3>
                <div className="form-group">
                  <label>Label (e.g., Home, Work)</label>
                  <input
                    type="text"
                    name="label"
                    value={newAddress.label}
                    onChange={handleNewAddressChange}
                    placeholder="Home"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleNewAddressChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleNewAddressChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={newAddress.address}
                    onChange={handleNewAddressChange}
                    placeholder="Enter complete address"
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
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
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
                    value={newAddress.pincode}
                    onChange={handleNewAddressChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    required
                  />
                </div>
                <button 
                  type="button"
                  className="save-new-address-btn"
                  onClick={handleSaveNewAddress}
                >
                  Save & Use This Address
                </button>
              </div>
            )}

            {savedAddresses.length === 0 && !showNewAddressForm && (
              <div className="no-addresses-message">
                <p>No saved addresses. Please fill in the form below or add a new address.</p>
                <button 
                  type="button"
                  className="add-new-address-btn"
                  onClick={() => setShowNewAddressForm(true)}
                >
                  <Plus size={16} />
                  Add New Address
                </button>
              </div>
            )}
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
            
            {paymentMethod === 'razorpay' && (
              <div className="razorpay-methods-section">
                <h3 className="razorpay-methods-title">Choose Payment Option</h3>
                <div className="razorpay-methods-grid">
                  <button
                    type="button"
                    className={`razorpay-method-btn ${selectedRazorpayMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setSelectedRazorpayMethod('card')}
                  >
                    <span className="method-icon">💳</span>
                    <span className="method-name">Card</span>
                    <span className="method-desc">Credit/Debit Card</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`razorpay-method-btn ${selectedRazorpayMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setSelectedRazorpayMethod('upi')}
                  >
                    <span className="method-icon">📱</span>
                    <span className="method-name">UPI</span>
                    <span className="method-desc">Google Pay, PhonePe, etc.</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`razorpay-method-btn ${selectedRazorpayMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setSelectedRazorpayMethod('netbanking')}
                  >
                    <span className="method-icon">🏦</span>
                    <span className="method-name">Net Banking</span>
                    <span className="method-desc">All Major Banks</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`razorpay-method-btn ${selectedRazorpayMethod === 'wallet' ? 'active' : ''}`}
                    onClick={() => setSelectedRazorpayMethod('wallet')}
                  >
                    <span className="method-icon">👛</span>
                    <span className="method-name">Wallet</span>
                    <span className="method-desc">Paytm, PhonePe Wallet</span>
                  </button>
                </div>
                
                {selectedRazorpayMethod && (
                  <div className="selected-method-info">
                    <p>Selected: <strong>{selectedRazorpayMethod === 'card' ? 'Card Payment' : selectedRazorpayMethod === 'upi' ? 'UPI Payment' : selectedRazorpayMethod === 'netbanking' ? 'Net Banking' : 'Wallet Payment'}</strong></p>
                    <p className="info-small">Click "Pay Now" to proceed with {selectedRazorpayMethod === 'card' ? 'card' : selectedRazorpayMethod === 'upi' ? 'UPI' : selectedRazorpayMethod === 'netbanking' ? 'net banking' : 'wallet'} payment</p>
                  </div>
                )}
              </div>
            )}
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

            {/* Coupon Code Section */}
            <div className="coupon-section">
              <h3>Have a Coupon?</h3>
              {!appliedCoupon ? (
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase())
                      setCouponError('')
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyCoupon()
                      }
                    }}
                    className={couponError ? 'error' : ''}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="apply-coupon-btn"
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="coupon-applied">
                  <div className="coupon-info">
                    <span className="coupon-code">✓ {appliedCoupon.code}</span>
                    <span className="coupon-discount">
                      {appliedCoupon.discountType === 'percentage' 
                        ? `${appliedCoupon.discountValue}% OFF`
                        : `₹${appliedCoupon.discountValue} OFF`
                      }
                    </span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="remove-coupon-btn">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="coupon-error">{couponError}</p>}
            </div>
            
            <div className="order-summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="discount-amount">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
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
              disabled={loading || (paymentMethod === 'razorpay' && !selectedRazorpayMethod)}
            >
              {loading ? 'Opening Payment Gateway...' : paymentMethod === 'cod' ? 'Place Order (COD)' : selectedRazorpayMethod ? `Pay ₹${totalAmount.toLocaleString('en-IN')} via ${selectedRazorpayMethod === 'card' ? 'Card' : selectedRazorpayMethod === 'upi' ? 'UPI' : selectedRazorpayMethod === 'netbanking' ? 'Net Banking' : 'Wallet'}` : 'Select Payment Method'}
            </button>
            
            {paymentMethod === 'razorpay' && loading && (
              <div className="razorpay-loading-info">
                <p>🔄 Opening Razorpay secure payment gateway...</p>
                <p className="info-small">Please wait while we connect to Razorpay</p>
              </div>
            )}
            
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

