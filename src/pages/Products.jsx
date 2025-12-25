import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductSection from '../components/ProductSection'
import { productsAPI, categoriesAPI } from '../utils/api'
import './Products.css'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all')
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProducts()
  }, [])

  useEffect(() => {
    // Update active category when URL parameter changes
    if (categoryParam) {
      setActiveCategory(categoryParam)
    } else {
      setActiveCategory('all')
    }
  }, [categoryParam])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch categories and products in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        categoriesAPI.getAll({ active: true }).catch(() => ({ success: false, data: [] })),
        productsAPI.getAll({ limit: 1000 })
      ])

      if (categoriesRes.success) {
        setCategories(categoriesRes.data || [])
      }

      if (productsRes.success) {
        const products = productsRes.data || []
        console.log('Fetched products:', products.length)
        setAllProducts(products)
        
        // Group products by category
        const grouped = {}
        categoriesRes.data?.forEach(cat => {
          grouped[cat.slug] = products.filter(p => p.category === cat.slug || p.category === cat.name)
        })
        
        // Legacy categories for backward compatibility
        const smartHome = products.filter(p =>
          p.category === 'smart-home' ||
          p.category === 'Electronics' ||
          p.category === 'Home & Kitchen' ||
          p.name?.toLowerCase().includes('robot') ||
          p.name?.toLowerCase().includes('smart') ||
          p.name?.toLowerCase().includes('storage') ||
          p.name?.toLowerCase().includes('organizer')
        )
        
        const diyKits = products.filter(p =>
          p.category === 'diy-kits' ||
          p.category === 'Hobbies' ||
          p.name?.toLowerCase().includes('book nook') ||
          p.name?.toLowerCase().includes('dollhouse') ||
          p.name?.toLowerCase().includes('miniature')
        )
        
        if (smartHome.length > 0) grouped['smart-home'] = smartHome
        if (diyKits.length > 0) grouped['diy-kits'] = diyKits
        
        setCategoryProducts(grouped)
      } else {
        console.error('Failed to fetch products:', productsRes)
        setError('Failed to load products. Please refresh the page.')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredProducts = () => {
    if (activeCategory === 'all') {
      return allProducts
    }
    return categoryProducts[activeCategory] || []
  }

  const getCategoryDisplayName = (slug) => {
    const category = categories.find(c => c.slug === slug)
    return category ? category.displayName : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover our complete collection of smart home solutions and creative DIY kits</p>
      </div>

      <div className="products-filters">
        <div className="container">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              className={`filter-btn ${activeCategory === category.slug ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              {category.icon && <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>}
              {category.displayName}
            </button>
          ))}
          {/* Legacy categories for backward compatibility */}
          {categories.length === 0 && (
            <>
              <button
                className={`filter-btn ${activeCategory === 'smart-home' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('smart-home')}
              >
                🏠 Smart Home
              </button>
              <button
                className={`filter-btn ${activeCategory === 'diy-kits' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('diy-kits')}
              >
                🎨 DIY Kits
              </button>
            </>
          )}
        </div>
      </div>

      {activeCategory === 'all' ? (
        <>
          {allProducts.length > 0 ? (
            <>
              {categories.map(category => {
                const catProducts = categoryProducts[category.slug] || []
                if (catProducts.length > 0) {
                  return (
                    <ProductSection
                      key={category._id}
                      title={category.displayName}
                      products={catProducts}
                      id={category.slug}
                    />
                  )
                }
                return null
              })}
              {/* Legacy categories */}
              {categoryProducts['smart-home']?.length > 0 && (
                <ProductSection
                  title="Smart Home Solutions"
                  products={categoryProducts['smart-home']}
                  id="smart-home"
                />
              )}
              {categoryProducts['diy-kits']?.length > 0 && (
                <ProductSection
                  title="DIY Miniature Kits"
                  products={categoryProducts['diy-kits']}
                  id="diy-kits"
                />
              )}
              {/* Show all products if no categories have products */}
              {categories.length === 0 && Object.keys(categoryProducts).length === 0 && allProducts.length > 0 && (
                <ProductSection
                  title="All Products"
                  products={allProducts}
                  id="all-products"
                />
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No products found. Please check back later.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {getFilteredProducts().length > 0 ? (
            <ProductSection
              title={getCategoryDisplayName(activeCategory)}
              products={getFilteredProducts()}
              id={activeCategory}
            />
          ) : (
            <div className="empty-state">
              <p>No products found in this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products

