import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Heart } from 'lucide-react'
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Support both _id (from API) and id (from static data)
  const productId = product._id || product.id

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    // Popup will be shown automatically by CartContext
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(product)
    }
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
      <Link to={`/product/${productId}`} className="product-link">
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
          <button
            className={`wishlist-btn ${isInWishlist(productId) ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
          >
            <Heart size={20} fill={isInWishlist(productId) ? "currentColor" : "none"} strokeWidth={2} />
          </button>
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

