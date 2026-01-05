import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Wallet, CreditCard, Package } from 'lucide-react'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrderDetails()
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const API_URL = 'https://myweb-hyh3.onrender.com/api'
      
      // Try to fetch from database first
      const response = await fetch(`${API_URL}/orders/${orderId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setOrderDetails(data.data)
          setLoading(false)
          return
        }
      }
      
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem('mechheaven_orders') || '[]')
      const order = orders.find(o => o.orderId === orderId)
      setOrderDetails(order)
    } catch (error) {
      console.error('Error fetching order:', error)
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem('mechheaven_orders') || '[]')
      const order = orders.find(o => o.orderId === orderId)
      setOrderDetails(order)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="order-success">
        <div className="order-success-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="order-success">
        <div className="order-success-container">
          <h2>Order not found</h2>
          <p>We couldn't find order #{orderId}</p>
          <Link to="/" className="back-home-btn">Go to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="order-success">
      <div className="order-success-container">
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: {orderDetails.orderId}</p>
        </div>

        <div className="order-details-card">
          <h2>Order Details</h2>
          
          <div className="detail-section">
            <h3>Shipping Address</h3>
            <p><strong>{orderDetails.customer.name}</strong></p>
            <p>{orderDetails.customer.address}</p>
            <p>{orderDetails.customer.city}, {orderDetails.customer.state} - {orderDetails.customer.pincode}</p>
            <p>Phone: {orderDetails.customer.phone}</p>
            <p>Email: {orderDetails.customer.email}</p>
          </div>

          <div className="detail-section">
            <h3>Payment Method</h3>
            <p className="payment-method">
              {orderDetails.paymentMethod === 'cod' ? (
                <><Wallet size={20} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Cash on Delivery</>
              ) : (
                <><CreditCard size={20} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Online Payment (Razorpay)</>
              )}
            </p>
          </div>

          <div className="detail-section order-items-section">
            <h3>Your Ordered Items ({orderDetails.items.length})</h3>
            <div className="order-items-list">
              {orderDetails.items.map((item, index) => (
                <div key={item.id || index} className="order-item-row-enhanced">
                  <Link to={`/product/${item.id || item._id || ''}`} className="item-image-link">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="item-thumbnail-enhanced"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Product'
                      }}
                    />
                  </Link>
                  <div className="item-info-enhanced">
                    <Link to={`/product/${item.id || item._id || ''}`}>
                      <h4 className="item-name-enhanced">{item.name}</h4>
                    </Link>
                    {item.brand && <p className="item-brand">{item.brand}</p>}
                    <div className="item-quantity-price">
                      <span className="quantity-badge">Qty: {item.quantity}</span>
                      <span className="price-per-item">× ₹{item.price?.toLocaleString('en-IN') || '0'}</span>
                    </div>
                  </div>
                  <div className="item-total-enhanced">
                    <span className="item-subtotal-label">Subtotal</span>
                    <span className="item-subtotal-amount">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Total Amount:</span>
              <span className="total-amount">₹{orderDetails.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
          <Link to="/products" className="view-products-btn">
            View Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

