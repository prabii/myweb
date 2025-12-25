import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Users, CheckCircle2, XCircle, Truck, Clock, Search } from 'lucide-react'
import './AdminDashboard.css'

const API_URL = 'http://localhost:5000/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.data)
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('adminToken')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Don't show error on initial load if backend is not running
      // User will see login form
      localStorage.removeItem('adminToken')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Login failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setAdmin(data.data)
        setIsAuthenticated(true)
      } else {
        alert('❌ Login Failed\n\n' + (data.message || 'Invalid credentials'))
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_FAILED')) {
        alert('❌ Cannot connect to backend server!\n\n' +
              'Please ensure:\n' +
              '1. Backend server is running on port 5000\n' +
              '2. Run: cd backend && npm run dev\n' +
              '3. Check if http://localhost:5000/api/health works\n\n' +
              'Error: ' + error.message)
      } else {
        alert('Login error: ' + error.message)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setAdmin(null)
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <div className="admin-login-container">
          <div className="admin-login-card">
            <h1>🔐 Admin Login</h1>
            <div className="backend-status">
              <p>Backend API: <span className="api-url">{API_URL}</span></p>
              <p className="status-hint">Make sure backend is running: <code>cd backend && npm run dev</code></p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="admin@mechheaven.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="admin123" />
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <button onClick={() => navigate('/')} className="back-btn">← Back to Site</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>🛠️ Admin Dashboard</h1>
          <div className="admin-info">
            <span>Welcome, {admin?.name || admin?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Orders
          </button>
          <button 
            className={activeTab === 'customers' ? 'active' : ''}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Customers
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
            Products
          </button>
          <button 
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            🏷️ Categories
          </button>
          <button 
            className={activeTab === 'sections' ? 'active' : ''}
            onClick={() => setActiveTab('sections')}
          >
            🎨 Homepage Sections
          </button>
          <button 
            className={activeTab === 'hero' ? 'active' : ''}
            onClick={() => setActiveTab('hero')}
          >
            🏠 Hero Section
          </button>
          <button 
            className={activeTab === 'coupons' ? 'active' : ''}
            onClick={() => setActiveTab('coupons')}
          >
            🎫 Coupons
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'sections' && <SectionsManager />}
          {activeTab === 'hero' && <HeroManager />}
          {activeTab === 'coupons' && <CouponsManager />}
        </div>
    </div>
  )
}

// Category Selector Component
const CategorySelector = ({ value, onChange }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories?active=true`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <select value={value} onChange={(e) => onChange(e.target.value)} required>
      <option value="">Loading...</option>
    </select>
  }

  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    >
      <option value="">-- Select Category --</option>
      {categories.map(category => (
        <option key={category._id} value={category.slug}>
          {category.icon && `${category.icon} `}{category.displayName}
        </option>
      ))}
      {/* Fallback options if no categories */}
      {categories.length === 0 && (
        <>
          <option value="all-products">All Products</option>
          <option value="smart-home">Smart Home</option>
          <option value="diy-kits">DIY Kits</option>
        </>
      )}
      <option value="featured">⭐ Featured</option>
    </select>
  )
}

// Products Manager Component
const ProductsManager = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: 0,
    category: '',
    image: '',
    images: [],
    rating: 0,
    reviews: 0,
    stock: 0,
    delivery: 'Free delivery',
    featured: false,
    active: true
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        const imageUrl = `http://localhost:5000${data.data.url}`
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }))
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      discount: parseFloat(formData.discount),
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      stock: parseInt(formData.stock)
    }

    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`
      
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(productData)
      })

      const data = await response.json()
      
      if (data.success) {
        alert(editingProduct ? 'Product updated!' : 'Product created!')
        setShowForm(false)
        setEditingProduct(null)
        resetForm()
        fetchProducts()
      } else {
        alert(data.message || 'Error saving product')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      const data = await response.json()
      if (data.success) {
        alert('Product deleted!')
        fetchProducts()
      }
    } catch (error) {
      alert('Error deleting product: ' + error.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      discount: product.discount || 0,
      category: product.category,
      image: product.image,
      images: product.images || [],
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      stock: product.stock || 0,
      delivery: product.delivery || 'Free delivery',
      featured: product.featured || false,
      active: product.active !== undefined ? product.active : true
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: 0,
      category: '',
      image: '',
      images: [],
      rating: 0,
      reviews: 0,
      stock: 0,
      delivery: 'Free delivery',
      featured: false,
      active: true
    })
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Products Management</h2>
        <button onClick={() => { setShowForm(true); resetForm(); setEditingProduct(null) }} className="add-btn">
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); setEditingProduct(null) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Brand *</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <CategorySelector 
                    value={formData.category}
                    onChange={(value) => setFormData({...formData, category: value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Product Image *</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="image-preview" />
                  )}
                  <input 
                    type="text" 
                    placeholder="Or enter image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="image-url-input"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    Featured Product
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); setEditingProduct(null) }}>
                  Cancel
                </button>
                <button type="submit">{editingProduct ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {products.length === 0 ? (
          <div className="empty-state">No products found. Click "+ Add Product" to create your first product.</div>
        ) : (
          products.map(product => (
            <div key={product._id} className="item-card">
              <img src={product.image} alt={product.name} className="item-image" />
              <div className="item-details">
                <h3>{product.name}</h3>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Price:</strong> ₹{product.price?.toLocaleString('en-IN') || '0'}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p><strong>Original Price:</strong> <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span></p>
                )}
                {product.discount > 0 && (
                  <p><strong>Discount:</strong> <span style={{ color: 'var(--gold)' }}>{product.discount}% OFF</span></p>
                )}
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Stock:</strong> {product.stock || 0}</p>
                <p><strong>Status:</strong> {product.active ? '✅ Active' : '❌ Inactive'} {product.featured && '⭐ Featured'}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(product)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(product._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Sections Manager Component
const SectionsManager = () => {
  const [sections, setSections] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    link: '',
    buttonText: 'Shop Now',
    position: 0,
    type: 'banner',
    active: true,
    metadata: {}
  })

  useEffect(() => {
    fetchSections()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products?limit=1000`)
      const data = await response.json()
      if (data.success) {
        setProducts(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const getToken = () => localStorage.getItem('adminToken')

  const fetchSections = async () => {
    try {
      const response = await fetch(`${API_URL}/sections`)
      const data = await response.json()
      if (data.success) {
        setSections(data.data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        const imageUrl = `http://localhost:5000${data.data.url}`
        setFormData(prev => ({...prev, image: imageUrl}))
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const url = editingSection 
        ? `${API_URL}/sections/${editingSection._id}`
        : `${API_URL}/sections`
      
      const method = editingSection ? 'PUT' : 'POST'

      // Prepare metadata for deal-of-day
      let metadata = {}
      if (formData.type === 'deal-of-day') {
        metadata = {
          timer: formData.metadata?.timer || '05:22',
          productId: formData.metadata?.productId || null
        }
      } else if (formData.metadata) {
        metadata = formData.metadata
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          position: parseInt(formData.position),
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(editingSection ? 'Section updated!' : 'Section created!')
        setShowForm(false)
        setEditingSection(null)
        resetForm()
        fetchSections()
      } else {
        alert(data.message || 'Error saving section')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return

    try {
      const response = await fetch(`${API_URL}/sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      const data = await response.json()
      if (data.success) {
        alert('Section deleted!')
        fetchSections()
      }
    } catch (error) {
      alert('Error deleting section: ' + error.message)
    }
  }

  const handleEdit = (section) => {
    setEditingSection(section)
    const metadata = section.metadata || {}
    setFormData({
      name: section.name,
      title: section.title,
      subtitle: section.subtitle || '',
      description: section.description || '',
      image: section.image,
      link: section.link || '',
      buttonText: section.buttonText || 'Shop Now',
      position: section.position || 0,
      type: section.type || 'banner',
      active: section.active !== undefined ? section.active : true,
      metadata: metadata
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      subtitle: '',
      description: '',
      image: '',
      link: '',
      buttonText: 'Shop Now',
      position: 0,
      type: 'banner',
      active: true
    })
  }

  if (loading) return <div className="loading">Loading sections...</div>

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Sections/Banners Management</h2>
        <button onClick={() => { setShowForm(true); resetForm(); setEditingSection(null) }} className="add-btn">
          + Add Section
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h3>{editingSection ? 'Edit Section' : 'Add New Section'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); setEditingSection(null) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Section Name *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value
                      setFormData({...formData, type: newType})
                      // Auto-fill name and title for specific types
                      if (newType === 'deal-of-day' && !formData.name) {
                        setFormData(prev => ({
                          ...prev,
                          type: newType,
                          name: 'deal-of-day',
                          title: 'Deal of the Day',
                          buttonText: 'ADD TO CART'
                        }))
                      }
                    }}
                    required
                  >
                    <option value="banner">Banner</option>
                    <option value="hero">Hero</option>
                    <option value="category">Category</option>
                    <option value="promotion">Promotion</option>
                    <option value="deal-of-day">Deal of the Day</option>
                    <option value="night-owl">Night Owl Sale</option>
                    <option value="categories-section">Categories Section</option>
                    <option value="featured-products">Featured Products</option>
                  </select>
                </div>
                {formData.type === 'deal-of-day' && (
                  <>
                    <div className="form-group full-width">
                      <label>Timer (HH:MM format, e.g., 05:22)</label>
                      <input 
                        type="text" 
                        value={formData.metadata?.timer || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          metadata: {
                            ...formData.metadata,
                            timer: e.target.value
                          }
                        })}
                        placeholder="05:22"
                        pattern="[0-9]{2}:[0-9]{2}"
                      />
                      <small>Format: HH:MM (e.g., 05:22 for 5 hours 22 minutes)</small>
                    </div>
                    <div className="form-group full-width">
                      <label>Select Product (Optional - Leave empty to use custom image)</label>
                      <select 
                        value={formData.metadata?.productId || ''}
                        onChange={(e) => {
                          const productId = e.target.value
                          const selectedProduct = products.find(p => p._id === productId)
                          setFormData({
                            ...formData,
                            image: selectedProduct ? selectedProduct.image : formData.image,
                            metadata: {
                              ...formData.metadata,
                              productId: productId || null
                            }
                          })
                        }}
                      >
                        <option value="">-- Select a Product (or use custom image) --</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - ₹{product.price?.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                      <small>Select a product to automatically use its image and details. Or leave empty and upload a custom image below.</small>
                    </div>
                    {formData.metadata?.productId && (
                      <div className="form-group full-width">
                        <div style={{ 
                          padding: '1rem', 
                          background: 'var(--dark-card)', 
                          borderRadius: '8px',
                          border: '1px solid var(--dark-border)'
                        }}>
                          <p style={{ margin: '0 0 0.5rem 0', color: 'var(--gold)', fontWeight: '600' }}>
                            Selected Product Preview:
                          </p>
                          {products.find(p => p._id === formData.metadata?.productId) && (
                            <div>
                              <p style={{ margin: '0.25rem 0', color: 'var(--text-light)' }}>
                                <strong>Name:</strong> {products.find(p => p._id === formData.metadata?.productId)?.name}
                              </p>
                              <p style={{ margin: '0.25rem 0', color: 'var(--text-light)' }}>
                                <strong>Price:</strong> ₹{products.find(p => p._id === formData.metadata?.productId)?.price?.toLocaleString('en-IN')}
                              </p>
                              <p style={{ margin: '0.25rem 0', color: 'var(--text-light)' }}>
                                <strong>Discount:</strong> {products.find(p => p._id === formData.metadata?.productId)?.discount || 0}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className="form-group full-width">
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Subtitle</label>
                  <input 
                    type="text" 
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Section Image {formData.type === 'deal-of-day' && formData.metadata?.productId ? '(Auto-filled from product)' : '*'}</label>
                  {formData.type === 'deal-of-day' && formData.metadata?.productId && (
                    <div style={{ 
                      padding: '0.75rem', 
                      background: 'rgba(212, 175, 55, 0.1)', 
                      border: '1px solid var(--gold)', 
                      borderRadius: '8px',
                      marginBottom: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'var(--gold)'
                    }}>
                      ℹ️ Image will be automatically set from the selected product. You can override it below if needed.
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={formData.type === 'deal-of-day' && formData.metadata?.productId}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="image-preview" />
                  )}
                  <input 
                    type="text" 
                    placeholder="Or enter image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="image-url-input"
                  />
                </div>
                <div className="form-group">
                  <label>Link URL</label>
                  <input 
                    type="text" 
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Button Text</label>
                  <input 
                    type="text" 
                    value={formData.buttonText}
                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input 
                    type="number" 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); setEditingSection(null) }}>
                  Cancel
                </button>
                <button type="submit">{editingSection ? 'Update' : 'Create'} Section</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {sections.length === 0 ? (
          <div className="empty-state">No sections found</div>
        ) : (
          sections.map(section => (
            <div key={section._id} className="item-card">
              <img src={section.image} alt={section.title} className="item-image" />
              <div className="item-details">
                <h3>{section.title}</h3>
                <p>{section.name} • Type: {section.type}</p>
                <p>Position: {section.position}</p>
                {section.type === 'deal-of-day' && section.metadata?.timer && (
                  <p style={{ color: 'var(--gold)', fontWeight: '600' }}>
                    ⏰ Timer: {section.metadata.timer}
                  </p>
                )}
                {section.type === 'deal-of-day' && section.metadata?.productId && (
                  <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    📦 Product ID: {section.metadata.productId.substring(0, 20)}...
                  </p>
                )}
                <p>Status: {section.active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(section)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(section._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Coupons Manager Component
// Hero Section Manager Component
const HeroManager = () => {
  const [heroData, setHeroData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tag: '• NEW SMART LIVING COLLECTION',
    title: 'Bring your Dream Home to Life.',
    description: 'Explore carefully curated collections for every kind of home. From intelligent robot vacuums to cozy miniature kits, make your space as smart as it looks.',
    stat1Number: '25k+',
    stat1Label: 'Happy Customers',
    stat2Number: '4.8+',
    stat2Label: 'Average Rating',
    stat3Number: '48hr',
    stat3Label: 'Fast Delivery',
    button1Text: 'SHOP BESTSELLERS',
    button1Link: '#popular',
    button2Text: 'BROWSE ALL CATEGORIES',
    button2Link: '#categories',
    backgroundImage: '',
    active: true
  })

  useEffect(() => {
    fetchHeroData()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchHeroData = async () => {
    try {
      const response = await fetch(`${API_URL}/sections?type=hero`)
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        const hero = data.data[0]
        setHeroData(hero)
        // Populate form with existing data
        // Mongoose returns metadata as plain object, not Map
        const metadata = hero.metadata || {}
        setFormData({
          tag: metadata.tag || formData.tag,
          title: hero.title || formData.title,
          description: hero.description || formData.description,
          stat1Number: metadata.stat1Number || formData.stat1Number,
          stat1Label: metadata.stat1Label || formData.stat1Label,
          stat2Number: metadata.stat2Number || formData.stat2Number,
          stat2Label: metadata.stat2Label || formData.stat2Label,
          stat3Number: metadata.stat3Number || formData.stat3Number,
          stat3Label: metadata.stat3Label || formData.stat3Label,
          button1Text: metadata.button1Text || formData.button1Text,
          button1Link: metadata.button1Link || formData.button1Link,
          button2Text: metadata.button2Text || formData.button2Text,
          button2Link: metadata.button2Link || formData.button2Link,
          backgroundImage: hero.image || '',
          active: hero.active !== undefined ? hero.active : true
        })
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        const imageUrl = `http://localhost:5000${data.data.url}`
        setFormData(prev => ({...prev, backgroundImage: imageUrl}))
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const metadata = new Map([
        ['tag', formData.tag],
        ['stat1Number', formData.stat1Number],
        ['stat1Label', formData.stat1Label],
        ['stat2Number', formData.stat2Number],
        ['stat2Label', formData.stat2Label],
        ['stat3Number', formData.stat3Number],
        ['stat3Label', formData.stat3Label],
        ['button1Text', formData.button1Text],
        ['button1Link', formData.button1Link],
        ['button2Text', formData.button2Text],
        ['button2Link', formData.button2Link]
      ])

      const heroSection = {
        name: 'hero-section',
        title: formData.title,
        description: formData.description,
        image: formData.backgroundImage,
        type: 'hero',
        position: 0,
        active: formData.active,
        metadata: Object.fromEntries(metadata)
      }

      const url = heroData 
        ? `${API_URL}/sections/${heroData._id}`
        : `${API_URL}/sections`
      
      const method = heroData ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(heroSection)
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Hero section saved!')
        setShowForm(false)
        fetchHeroData()
      } else {
        alert(data.message || 'Error saving hero section')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (loading) return <div className="loading">Loading hero section...</div>

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>🏠 Hero Section Management</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">
          {heroData ? 'Edit Hero Section' : 'Create Hero Section'}
        </button>
      </div>

      {heroData && !showForm && (
        <div className="preview-card">
          <h3>Current Hero Section</h3>
          <div className="preview-content">
            <img src={heroData.image} alt="Hero" className="preview-image" />
            <div className="preview-details">
              <h4>{heroData.title}</h4>
              <p>{heroData.description}</p>
              <p className="preview-status">Status: {heroData.active ? '✅ Active' : '❌ Inactive'}</p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h3>Edit Hero Section</h3>
              <button onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tag Line</label>
                  <input 
                    type="text" 
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    placeholder="• NEW SMART LIVING COLLECTION"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Main Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stat 1 Number</label>
                  <input 
                    type="text" 
                    value={formData.stat1Number}
                    onChange={(e) => setFormData({...formData, stat1Number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stat 1 Label</label>
                  <input 
                    type="text" 
                    value={formData.stat1Label}
                    onChange={(e) => setFormData({...formData, stat1Label: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stat 2 Number</label>
                  <input 
                    type="text" 
                    value={formData.stat2Number}
                    onChange={(e) => setFormData({...formData, stat2Number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stat 2 Label</label>
                  <input 
                    type="text" 
                    value={formData.stat2Label}
                    onChange={(e) => setFormData({...formData, stat2Label: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stat 3 Number</label>
                  <input 
                    type="text" 
                    value={formData.stat3Number}
                    onChange={(e) => setFormData({...formData, stat3Number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Stat 3 Label</label>
                  <input 
                    type="text" 
                    value={formData.stat3Label}
                    onChange={(e) => setFormData({...formData, stat3Label: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Button 1 Text</label>
                  <input 
                    type="text" 
                    value={formData.button1Text}
                    onChange={(e) => setFormData({...formData, button1Text: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Button 1 Link</label>
                  <input 
                    type="text" 
                    value={formData.button1Link}
                    onChange={(e) => setFormData({...formData, button1Link: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Button 2 Text</label>
                  <input 
                    type="text" 
                    value={formData.button2Text}
                    onChange={(e) => setFormData({...formData, button2Text: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Button 2 Link</label>
                  <input 
                    type="text" 
                    value={formData.button2Link}
                    onChange={(e) => setFormData({...formData, button2Link: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Background Image</label>
                  {formData.backgroundImage && (
                    <img src={formData.backgroundImage} alt="Preview" className="image-preview" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <small>Upload a new image or keep existing</small>
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">Save Hero Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Categories Manager Component
const CategoriesManager = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    displayName: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    position: 0,
    active: true
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const response = await fetch(`${API_URL}/upload/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formDataUpload
      })

      const data = await response.json()
      if (data.success) {
        const imageUrl = `http://localhost:5000${data.data.url}`
        setFormData(prev => ({...prev, image: imageUrl}))
      }
    } catch (error) {
      alert('Image upload failed: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Auto-generate slug from displayName if not provided
    const slug = formData.slug || formData.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    try {
      const url = editingCategory 
        ? `${API_URL}/categories/${editingCategory._id}`
        : `${API_URL}/categories`
      
      const method = editingCategory ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          slug,
          name: slug,
          position: parseInt(formData.position)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(editingCategory ? 'Category updated!' : 'Category created!')
        setShowForm(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      } else {
        alert(data.message || 'Error saving category')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products using this category will need to be updated.')) return

    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      const data = await response.json()
      if (data.success) {
        alert('Category deleted!')
        fetchCategories()
      }
    } catch (error) {
      alert('Error deleting category: ' + error.message)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      displayName: category.displayName,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      icon: category.icon || '',
      position: category.position || 0,
      active: category.active !== undefined ? category.active : true
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      displayName: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      position: 0,
      active: true
    })
  }

  if (loading) return <div className="loading">Loading categories...</div>

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Categories Management</h2>
        <button onClick={() => { setShowForm(true); resetForm(); setEditingCategory(null) }} className="add-btn">
          + Add Category
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); setEditingCategory(null) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Category Name (Display) *</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => {
                      const displayName = e.target.value
                      setFormData({
                        ...formData,
                        displayName,
                        slug: formData.slug || displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      })
                    }}
                    placeholder="e.g., Smart Home"
                    required
                  />
                  <small>This will appear in the navigation menu</small>
                </div>
                <div className="form-group full-width">
                  <label>Slug (URL-friendly) *</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')})}
                    placeholder="e.g., smart-home"
                    required
                  />
                  <small>Auto-generated from name. Used in URLs (e.g., /products?category=smart-home)</small>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Category Image (Optional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="image-preview" />
                  )}
                  <input 
                    type="text" 
                    placeholder="Or enter image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="image-url-input"
                  />
                </div>
                <div className="form-group">
                  <label>Icon (Emoji or Text)</label>
                  <input 
                    type="text" 
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="🏠"
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input 
                    type="number" 
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                  />
                  <small>Lower numbers appear first</small>
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); setEditingCategory(null) }}>
                  Cancel
                </button>
                <button type="submit">{editingCategory ? 'Update' : 'Create'} Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {categories.length === 0 ? (
          <div className="empty-state">No categories found. Click "+ Add Category" to create your first category.</div>
        ) : (
          categories.map(category => (
            <div key={category._id} className="item-card">
              {category.image && (
                <img src={category.image} alt={category.displayName} className="item-image" />
              )}
              <div className="item-details">
                <h3>
                  {category.icon && <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>}
                  {category.displayName}
                </h3>
                <p><strong>Slug:</strong> {category.slug}</p>
                {category.description && <p>{category.description}</p>}
                <p><strong>Position:</strong> {category.position}</p>
                <p><strong>Status:</strong> {category.active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(category)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(category._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const CouponsManager = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: 0,
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    active: true
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const getToken = () => localStorage.getItem('adminToken')

  const fetchCoupons = async () => {
    try {
      const response = await fetch(`${API_URL}/coupons`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCoupons(data.data)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const couponData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minPurchase: parseFloat(formData.minPurchase) || 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    }

    try {
      const url = editingCoupon 
        ? `${API_URL}/coupons/${editingCoupon._id}`
        : `${API_URL}/coupons/create`
      
      const method = editingCoupon ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(couponData)
      })

      const data = await response.json()
      
      if (data.success) {
        alert(editingCoupon ? 'Coupon updated!' : 'Coupon created!')
        setShowForm(false)
        setEditingCoupon(null)
        resetForm()
        fetchCoupons()
      } else {
        alert(data.message || 'Error saving coupon')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return

    try {
      const response = await fetch(`${API_URL}/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      const data = await response.json()
      if (data.success) {
        alert('Coupon deleted!')
        fetchCoupons()
      }
    } catch (error) {
      alert('Error deleting coupon: ' + error.message)
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString() : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString() : '',
      usageLimit: coupon.usageLimit || '',
      active: coupon.active !== undefined ? coupon.active : true
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: 0,
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      active: true
    })
  }

  // Format date for display in datetime-local input
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      return date.toISOString().slice(0, 16)
    } catch {
      return ''
    }
  }

  if (loading) return <div className="loading">Loading coupons...</div>

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Coupons Management</h2>
        <button onClick={() => { setShowForm(true); resetForm(); setEditingCoupon(null) }} className="add-btn">
          + Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-header">
              <h3>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); setEditingCoupon(null) }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="SAVE20"
                  />
                </div>
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select 
                    value={formData.discountType}
                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    required
                    placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                  />
                </div>
                <div className="form-group">
                  <label>Min Purchase (₹)</label>
                  <input 
                    type="number" 
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                  />
                </div>
                {formData.discountType === 'percentage' && (
                  <div className="form-group">
                    <label>Max Discount (₹)</label>
                    <input 
                      type="number" 
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Start Date *</label>
                  <input 
                    type="datetime-local" 
                    value={formatDateTimeLocal(formData.startDate)}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date *</label>
                  <input 
                    type="datetime-local" 
                    value={formatDateTimeLocal(formData.endDate)}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : ''})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Usage Limit</label>
                  <input 
                    type="number" 
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); setEditingCoupon(null) }}>
                  Cancel
                </button>
                <button type="submit">{editingCoupon ? 'Update' : 'Create'} Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="items-list">
        {coupons.length === 0 ? (
          <div className="empty-state">No coupons found</div>
        ) : (
          coupons.map(coupon => (
            <div key={coupon._id} className="item-card">
              <div className="item-details">
                <h3>{coupon.code}</h3>
                <p>
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% OFF` 
                    : `₹${coupon.discountValue} OFF`}
                </p>
                <p>Min Purchase: ₹{coupon.minPurchase}</p>
                <p>Used: {coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
                <p>Valid: {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</p>
                <p>Status: {coupon.active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(coupon)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(coupon._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Orders Manager Component
const OrdersManager = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState(null)

  const getToken = () => localStorage.getItem('adminToken')

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/orders?limit=100`
      
      if (statusFilter && statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data) {
        setOrders(data.data)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert(`Failed to load orders from database: ${error.message}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/orders/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    const previousStatus = orders.find(o => o._id === orderId)?.status
    
    try {
      // Optimistically update UI immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      )

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        // Revert optimistic update on error
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: previousStatus }
              : order
          )
        )
        throw new Error(data.message || `Failed to update order status: ${response.status}`)
      }

      // Update with server response to ensure consistency
      if (data.data) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, status: data.data.status, ...data.data }
              : order
          )
        )
      }

      // Refresh stats
      fetchStats()
      
      console.log(`✅ Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert(`Failed to update order status: ${error.message}`)
      // Refresh orders to get correct state from server
      fetchOrders()
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      processing: '#3498db',
      confirmed: '#2ecc71',
      shipped: '#9b59b6',
      'in-transit': '#e67e22',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    }
    return colors[status] || '#95a5a6'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />
      case 'processing':
        return <Clock size={16} />
      case 'confirmed':
        return <CheckCircle2 size={16} />
      case 'shipped':
      case 'in-transit':
        return <Truck size={16} />
      case 'delivered':
        return <CheckCircle2 size={16} />
      case 'cancelled':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="manager-container">
      <h2>Orders Management</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalOrders || 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pendingOrders || 0}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.processingOrders || 0}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.deliveredOrders || 0}</div>
            <div className="stat-label">Delivered</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <label>Filter by Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="items-list">
        {orders.length === 0 ? (
          <div className="empty-state">No orders found</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="item-card order-card">
              <div className="item-details">
                <div className="order-header-info">
                  <h3>Order #{order.orderId || order._id}</h3>
                  <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status || 'pending') }}>
                    {getStatusIcon(order.status || 'pending')}
                    <span style={{ marginLeft: '0.5rem' }}>
                      {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                    </span>
                  </div>
                </div>
                <p><strong>Customer:</strong> {order.customer?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {order.customer?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer?.phone || 'N/A'}</p>
                <p><strong>Items:</strong> {order.items?.length || 0} item(s)</p>
                <p><strong>Amount:</strong> ₹{(order.amount || 0).toLocaleString('en-IN')}</p>
                <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>Date:</strong> {new Date(order.date || order.createdAt).toLocaleString('en-IN')}</p>
                {order.coupon && <p><strong>Coupon:</strong> {order.coupon}</p>}
              </div>
              <div className="item-actions">
                <div className="status-change-section">
                  <label>Change Status:</label>
                  <select 
                    value={order.status || 'pending'} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  className="view-btn" 
                  onClick={() => {
                    const orderId = order._id
                    setSelectedOrder(selectedOrder === orderId ? null : orderId)
                  }}
                >
                  {selectedOrder === order._id ? 'Hide' : 'View'} Details
                </button>
              </div>
              {selectedOrder === order._id && (
                <div className="order-details-expanded">
                  <h4>Shipping Address:</h4>
                  <p>{order.customer?.address}</p>
                  <p>{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
                  
                  <h4>Order Items:</h4>
                  <div className="order-items-list">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <img src={item.image} alt={item.name} className="order-item-image-small" />
                        <div className="order-item-info">
                          <p><strong>{item.name}</strong></p>
                          <p>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="order-item-total">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-summary">
                    <p>Subtotal: ₹{(order.subtotal || 0).toLocaleString('en-IN')}</p>
                    {order.discount > 0 && <p>Discount: -₹{order.discount.toLocaleString('en-IN')}</p>}
                    <p><strong>Total: ₹{(order.amount || 0).toLocaleString('en-IN')}</strong></p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Customers Manager Component
const CustomersManager = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState(null)

  const getToken = () => localStorage.getItem('adminToken')

  useEffect(() => {
    fetchCustomers()
    fetchStats()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      let url = `${API_URL}/customers?limit=100`
      
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to fetch customers: ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.data) {
        setCustomers(data.data)
      } else {
        setCustomers([])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert(`Failed to load customers from database: ${error.message}`)
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/customers/stats/overview`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = () => {
    fetchCustomers()
  }

  if (loading) return <div className="loading">Loading customers...</div>

  return (
    <div className="manager-container">
      <h2>Customers Management</h2>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalCustomers || 0}</div>
            <div className="stat-label">Total Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.customersWithOrders || 0}</div>
            <div className="stat-label">With Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.newCustomersToday || 0}</div>
            <div className="stat-label">New Today</div>
          </div>
        </div>
      )}

      <div className="filter-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <div className="items-list">
        {customers.length === 0 ? (
          <div className="empty-state">No customers found</div>
        ) : (
          customers.map((customer) => (
            <div key={customer._id || customer.email} className="item-card customer-card">
              <div className="item-details">
                <h3>{customer.name || 'Unknown'}</h3>
                <p><strong>Email:</strong> {customer.email}</p>
                {customer.phone && <p><strong>Phone:</strong> {customer.phone}</p>}
                <p><strong>Total Orders:</strong> {customer.totalOrders || 0}</p>
                <p><strong>Total Spent:</strong> ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</p>
                {customer.lastOrderDate && (
                  <p><strong>Last Order:</strong> {new Date(customer.lastOrderDate).toLocaleDateString('en-IN')}</p>
                )}
                {customer.addresses && customer.addresses.length > 0 && (
                  <p><strong>Saved Addresses:</strong> {customer.addresses.length}</p>
                )}
              </div>
              <div className="item-actions">
                <button 
                  className="view-btn" 
                  onClick={() => setSelectedCustomer(selectedCustomer === customer.email ? null : customer.email)}
                >
                  {selectedCustomer === customer.email ? 'Hide' : 'View'} Details
                </button>
              </div>
              {selectedCustomer === customer.email && (
                <div className="customer-details-expanded">
                  {customer.addresses && customer.addresses.length > 0 && (
                    <>
                      <h4>Saved Addresses:</h4>
                      {customer.addresses.map((addr, idx) => (
                        <div key={idx} className="customer-address">
                          <p><strong>{addr.label || 'Address'}:</strong></p>
                          <p>{addr.name}</p>
                          <p>{addr.address}</p>
                          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p>Phone: {addr.phone}</p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
