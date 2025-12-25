import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import ProductSection from '../components/ProductSection'
import { sectionsAPI, productsAPI } from '../utils/api'
import './Home.css'

const Home = () => {
  const { addToCart } = useCart()
  const [heroData, setHeroData] = useState(null)
  const [dealOfDay, setDealOfDay] = useState(null)
  const [dealProduct, setDealProduct] = useState(null)
  const [categoriesSection, setCategoriesSection] = useState(null)
  const [nightOwlSection, setNightOwlSection] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timer, setTimer] = useState('00:00')
  
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [heroRes, dealRes, categoriesRes, nightOwlRes, productsRes] = await Promise.all([
        sectionsAPI.getHero().catch(() => ({ success: false, data: [] })),
        sectionsAPI.getDealOfDay().catch(() => ({ success: false, data: [] })),
        sectionsAPI.getCategories().catch(() => ({ success: false, data: [] })),
        sectionsAPI.getNightOwl().catch(() => ({ success: false, data: [] })),
        productsAPI.getFeatured().catch(() => ({ success: false, data: [] })),
      ])

      // Set hero data
      if (heroRes.success && heroRes.data.length > 0) {
        setHeroData(heroRes.data[0])
      }

      // Set deal of the day
      if (dealRes.success && dealRes.data.length > 0) {
        const deal = dealRes.data[0]
        setDealOfDay(deal)
        // If deal has a product ID in metadata, fetch that product
        if (deal.metadata?.productId) {
          try {
            const productRes = await productsAPI.getById(deal.metadata.productId)
            if (productRes.success) {
              setDealProduct(productRes.data)
            }
          } catch (err) {
            console.error('Error fetching deal product:', err)
          }
        }
      }

      // Set categories section
      if (categoriesRes.success && categoriesRes.data.length > 0) {
        setCategoriesSection(categoriesRes.data[0])
      }

      // Set night owl section
      if (nightOwlRes.success && nightOwlRes.data.length > 0) {
        setNightOwlSection(nightOwlRes.data[0])
      }

      // Set featured products
      if (productsRes.success && productsRes.data) {
        setFeaturedProducts(productsRes.data)
      }

    } catch (err) {
      console.error('Error fetching home data:', err)
      setError('Failed to load homepage content. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const handleDealAddToCart = () => {
    if (dealProduct) {
      addToCart(dealProduct)
    }
  }

  // Get hero metadata helper
  const getHeroMetadata = (key, defaultValue = '') => {
    if (!heroData?.metadata) return defaultValue
    return heroData.metadata[key] || defaultValue
  }

  // Get section metadata helper
  const getSectionMetadata = (section, key, defaultValue = '') => {
    if (!section?.metadata) return defaultValue
    return section.metadata[key] || defaultValue
  }

  // Countdown timer effect
  useEffect(() => {
    if (!dealOfDay) return

    const timerValue = getSectionMetadata(dealOfDay, 'timer', '05:22')
    const [hours, minutes] = timerValue.split(':').map(Number)
    
    if (isNaN(hours) || isNaN(minutes)) {
      setTimer('05:22') // Default fallback
      return
    }

    // Calculate total seconds
    let totalSeconds = (hours * 3600) + (minutes * 60)

    const updateTimer = () => {
      if (totalSeconds <= 0) {
        setTimer('00:00')
        return
      }

      const h = Math.floor(totalSeconds / 3600)
      const m = Math.floor((totalSeconds % 3600) / 60)
      const s = totalSeconds % 60

      setTimer(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
      totalSeconds--
    }

    // Initial update
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [dealOfDay])

  if (loading) {
    return (
      <div className="home">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchHomeData}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="home">
      <div className="hero-container">
        <div className="hero-section">
          {heroData?.image && (
            <div className="hero-image-wrapper">
              <img src={heroData.image} alt={heroData.title || 'Hero'} className="hero-image" />
            </div>
          )}
          <div className="hero-content">
            <span className="hero-tag">{getHeroMetadata('tag', '• NEW SMART LIVING COLLECTION')}</span>
            <h1>{heroData?.title || 'Bring your Dream Home to Life.'}</h1>
            <p className="hero-description">
              {heroData?.description || 'Explore carefully curated collections for every kind of home. From intelligent robot vacuums to cozy miniature kits, make your space as smart as it looks.'}
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{getHeroMetadata('stat1Number', '25k+')}</span>
                <span className="stat-label">{getHeroMetadata('stat1Label', 'Happy Customers')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{getHeroMetadata('stat2Number', '4.8+')}</span>
                <span className="stat-label">{getHeroMetadata('stat2Label', 'Average Rating')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{getHeroMetadata('stat3Number', '48hr')}</span>
                <span className="stat-label">{getHeroMetadata('stat3Label', 'Fast Delivery')}</span>
              </div>
            </div>
            <div className="hero-actions">
              <a href={getHeroMetadata('button1Link', '#popular')} className="hero-btn">
                {getHeroMetadata('button1Text', 'SHOP BESTSELLERS')}
              </a>
              <a href={getHeroMetadata('button2Link', '#categories')} className="hero-btn">
                {getHeroMetadata('button2Text', 'BROWSE ALL CATEGORIES')}
              </a>
            </div>
          </div>
        </div>

        <div className="deal-section-wrapper">
          {dealOfDay ? (
            <div className="deal-section">
              <div className="deal-header">
                <h2>{dealOfDay.title || 'Deal of the Day'}</h2>
                <div className="deal-timer">{timer}</div>
              </div>
              {dealProduct ? (
                <div className="deal-product">
                  <img src={dealProduct.image} alt={dealProduct.name} className="deal-image" />
                  <h3>{dealProduct.name}</h3>
                  <div className="deal-pricing">
                    <span className="deal-price">₹{dealProduct.price?.toLocaleString('en-IN') || '0'}</span>
                    {dealProduct.discount > 0 && (
                      <span className="deal-discount">{dealProduct.discount}% OFF</span>
                    )}
                  </div>
                  <div className="deal-delivery">
                    <span className="delivery-icon">✓</span>
                    <span>{dealProduct.delivery || 'Free delivery this weekend'}</span>
                  </div>
                  <button className="deal-btn" onClick={handleDealAddToCart}>ADD TO CART</button>
                </div>
              ) : dealOfDay.image ? (
                <div className="deal-product">
                  <img src={dealOfDay.image} alt={dealOfDay.title} className="deal-image" />
                  <h3>{dealOfDay.title}</h3>
                  {dealOfDay.description && <p style={{ color: 'var(--text-light)', textAlign: 'left', width: '100%' }}>{dealOfDay.description}</p>}
                  {dealOfDay.link && (
                    <a href={dealOfDay.link} className="deal-btn" style={{ textDecoration: 'none', display: 'block' }}>{dealOfDay.buttonText || 'VIEW DEAL'}</a>
                  )}
                </div>
              ) : (
                <div className="deal-product">
                  <p style={{ color: 'var(--text-light)', opacity: 0.7 }}>No deal available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="deal-section">
              <div className="deal-header">
                <h2>Deal of the Day</h2>
                <div className="deal-timer">00:00:00</div>
              </div>
              <div className="deal-product">
                <p style={{ color: 'var(--text-light)', opacity: 0.7 }}>Check back soon for amazing deals!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {categoriesSection && (
        <div className="categories-section" id="categories">
          <h2 className="section-title">{categoriesSection.title || 'Categories'}</h2>
          <p className="section-subtitle">{categoriesSection.subtitle || categoriesSection.description || 'Explore carefully curated collections for every kind of home and dream'}</p>
          <div className="category-filters">
            {getSectionMetadata(categoriesSection, 'categories', '').split(',').map((cat, idx) => (
              cat.trim() && (
                <button key={idx} className="category-btn">{cat.trim()}</button>
              )
            ))}
            {!getSectionMetadata(categoriesSection, 'categories') && (
              <>
                <button className="category-btn active">All Products</button>
                <button className="category-btn">Robot Vacuum</button>
                <button className="category-btn">DIY Book Nook Kits</button>
                <button className="category-btn">Miniature Dollhouses</button>
                <button className="category-btn">Smart Lighting</button>
              </>
            )}
          </div>
        </div>
      )}

      {featuredProducts.length > 0 && (
        <ProductSection 
          title="Featured Products" 
          products={featuredProducts}
          id="popular"
        />
      )}

      {nightOwlSection && (
        <div className="night-owl-section">
          <div className="night-owl-content">
            <div className="night-owl-text">
              <h2>
                <span className="moon-icon">🌙</span>
                {nightOwlSection.title || 'Night Owl Sale'}
              </h2>
              <p>{nightOwlSection.description || 'Build your dream nook this weekend. Combine any 2 DIY miniature kits and enjoy free LED upgrade kits on us.'}</p>
              <button 
                className="night-owl-btn" 
                onClick={() => window.location.href = nightOwlSection.link || '#popular'}
              >
                {nightOwlSection.buttonText || 'GRAB THE DEAL'}
              </button>
            </div>
            {nightOwlSection.image && (
              <div className="night-owl-image">
                <img src={nightOwlSection.image} alt={nightOwlSection.title} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

