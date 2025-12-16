import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPopup.css'

const CartPopup = ({ isOpen, onClose, lastAddedProduct }) => {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, getCartTotal } = useCart()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (lastAddedProduct) {
      const item = cartItems.find(item => item.id === lastAddedProduct.id)
      if (item) {
        setQuantity(item.quantity)
      }
    }
  }, [cartItems, lastAddedProduct])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !lastAddedProduct) return null

  const renderStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}>
          ★
        </span>
      )
    }
    return stars
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity)
      updateQuantity(lastAddedProduct.id, newQuantity)
    }
  }

  const handleViewCart = () => {
    onClose()
    navigate('/cart')
  }

  const handleCheckout = () => {
    onClose()
    navigate('/cart')
  }

  const itemTotal = lastAddedProduct.price * quantity

  return (
    <div className="cart-popup-overlay" onClick={onClose}>
      <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
        <button className="cart-popup-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="cart-popup-content">
          <h3 className="cart-popup-title">{lastAddedProduct.name}</h3>
          
          <div className="cart-popup-rating">
            <div className="stars">{renderStars(lastAddedProduct.rating)}</div>
          </div>

          <div className="cart-popup-quantity-section">
            <span className="quantity-label">Quantity</span>
            <div className="quantity-controls-popup">
              <button onClick={() => handleQuantityChange(quantity - 1)}>−</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="cart-popup-price">
            <span className="price-label">Price</span>
            <span className="price-value">₹{itemTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="cart-popup-subtotal">
            <span className="subtotal-label">Subtotal</span>
            <span className="subtotal-value">₹{itemTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="cart-popup-actions">
            <button className="view-cart-btn" onClick={handleViewCart}>
              VIEW CART
            </button>
            <button className="checkout-btn-popup" onClick={handleCheckout}>
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPopup

