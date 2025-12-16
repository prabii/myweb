import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    // Popup will be shown automatically by CartContext
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const getImageUrl = () => {
    if (imageError) {
      // Fallback placeholder image
      return 'https://via.placeholder.com/400x300?text=Product+Image'
    }
    return product.image
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>)
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<span key={i} className="star">★</span>)
    }
    return stars
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          {imageLoading && !imageError && (
            <div className="image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img 
            src={getImageUrl()} 
            alt={product.name} 
            className={`product-image ${imageLoading ? 'loading' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          {product.discount > 0 && (
            <span className="discount-badge">{product.discount}% Off</span>
          )}
        </div>
        <div className="product-info">
          <p className="product-brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="reviews">({product.reviews})</span>
          </div>
          <div className="product-pricing">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <p className="delivery-info">{product.delivery}</p>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to cart
      </button>
    </div>
  )
}

export default ProductCard

