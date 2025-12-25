import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Wallet, CreditCard } from 'lucide-react'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const { orderId } = useParams()
  const [orderDetails, setOrderDetails] = useState(null)

  useEffect(() => {
    // Get order details from localStorage
    const orders = JSON.parse(localStorage.getItem('mechheaven_orders') || '[]')
    const order = orders.find(o => o.orderId === orderId)
    setOrderDetails(order)
  }, [orderId])

  if (!orderDetails) {
    return (
      <div className="order-success">
        <div className="order-success-container">
          <h2>Order not found</h2>
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

          <div className="detail-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {orderDetails.items.map(item => (
                <div key={item.id} className="order-item-row">
                  <img src={item.image} alt={item.name} className="item-thumbnail" />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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

