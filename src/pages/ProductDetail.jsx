import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '../utils/api'
import { useCart } from '../context/CartContext'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productsAPI.getById(id)
      if (response.success) {
        setProduct(response.data)
      } else {
        setError('Product not found')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-detail">
        <div className="not-found">
          <h2>{error || 'Product not found'}</h2>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    )
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

  const handleAddToCart = () => {
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
      return 'https://via.placeholder.com/600x600?text=Product+Image'
    }
    return product.image
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-image-section">
          {imageLoading && !imageError && (
            <div className="detail-image-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img 
            src={getImageUrl()} 
            alt={product.name} 
            className={`detail-image ${imageLoading ? 'loading' : ''}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
        <div className="product-details-section">
          <p className="detail-brand">{product.brand}</p>
          <h1 className="detail-name">{product.name}</h1>
          <div className="detail-rating">
            <div className="stars">{renderStars(product.rating)}</div>
            <span className="reviews">({product.reviews} reviews)</span>
          </div>
          <div className="detail-pricing">
            <div className="price-group">
              <span className="detail-current-price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice > product.price && (
                <span className="detail-original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <span className="detail-discount">{product.discount}% OFF</span>
            )}
          </div>
          <div className="detail-info-box">
            <div className="info-item">
              <strong>Category:</strong> {product.category}
            </div>
            <div className="info-item delivery-item">
              <strong>Delivery:</strong> <span className="delivery-highlight">{product.delivery}</span>
            </div>
          </div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <button className="detail-add-to-cart" onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <button className="detail-buy-now" onClick={() => {
              addToCart(product)
              navigate('/cart')
            }}>
              BUY NOW
            </button>
          </div>
          {product.amazonUrl && product.amazonUrl.includes('[ASIN]') === false && (
            <a 
              href={product.amazonUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="amazon-link"
            >
              View on Amazon →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

