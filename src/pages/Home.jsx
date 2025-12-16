import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import ProductSection from '../components/ProductSection'
import { getPopularProducts, getLatestArrivals } from '../data/products'
import './Home.css'

const Home = () => {
  const { addToCart } = useCart()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const popularProducts = getPopularProducts()
  const latestArrivals = getLatestArrivals()

  const dealProduct = popularProducts[0]

  const handleDealAddToCart = () => {
    if (dealProduct) {
      addToCart(dealProduct)
      // Popup will be shown automatically by CartContext
    }
  }

  return (
    <div className="home">
      <div className="hero-container">
        <div className="hero-section">
          <div className="hero-content">
            <span className="hero-tag">• NEW SMART LIVING COLLECTION</span>
            <h1>Bring your Dream Home to Life.</h1>
            <p className="hero-description">
              Explore carefully curated collections for every kind of home. From intelligent robot vacuums to cozy miniature kits, make your space as smart as it looks.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">25k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8+</span>
                <span className="stat-label">Average Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">48hr</span>
                <span className="stat-label">Fast Delivery</span>
              </div>
            </div>
            <div className="hero-actions">
              <a href="#popular" className="hero-btn">SHOP BESTSELLERS</a>
              <a href="#categories" className="hero-btn">BROWSE ALL CATEGORIES</a>
            </div>
          </div>
        </div>

        <div className="deal-section">
          <div className="deal-header">
            <h2>Deal of the Day</h2>
            <div className="deal-timer">05:22</div>
          </div>
          {dealProduct && (
            <div className="deal-product">
              <img src={dealProduct.image} alt={dealProduct.name} className="deal-image" />
              <h3>{dealProduct.name}</h3>
              <div className="deal-pricing">
                <span className="deal-price">₹{dealProduct.price.toLocaleString('en-IN')}</span>
                <span className="deal-discount">{dealProduct.discount}% OFF</span>
              </div>
              <div className="deal-delivery">
                <span className="delivery-icon">✓</span>
                <span>Free delivery this weekend</span>
              </div>
              <button className="deal-btn" onClick={handleDealAddToCart}>ADD TO CART</button>
            </div>
          )}
        </div>
      </div>

      <div className="categories-section" id="categories">
        <h2 className="section-title">Categories</h2>
        <p className="section-subtitle">Explore carefully curated collections for every kind of home and dream</p>
        <div className="category-filters">
          <button className="category-btn active">All Products</button>
          <button className="category-btn">Robot Vacuum</button>
          <button className="category-btn">DIY Book Nook Kits</button>
          <button className="category-btn">Miniature Dollhouses</button>
          <button className="category-btn">Smart Lighting</button>
        </div>
      </div>

      <ProductSection 
        title="Featured Products" 
        products={popularProducts}
        id="popular"
      />

      <div className="night-owl-section">
        <div className="night-owl-content">
          <div className="night-owl-text">
            <h2>
              <span className="moon-icon">🌙</span>
              Night Owl Sale
            </h2>
            <p>Build your dream nook this weekend. Combine any 2 DIY miniature kits and enjoy free LED upgrade kits on us.</p>
            <button className="night-owl-btn" onClick={() => window.location.href = '#popular'}>GRAB THE DEAL</button>
          </div>
          <div className="night-owl-image">
            <img src={popularProducts[1]?.image || popularProducts[0]?.image} alt="DIY Kit" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

