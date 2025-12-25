import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { categoriesAPI } from '../utils/api'
import { 
  ChevronDown, 
  Grid3x3, 
  Search, 
  User, 
  ShoppingBag, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react'
import './Header.css'

const Header = () => {
  const { getCartCount, setShowLoginModal } = useCart()
  const { isBlackWhite, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [categories, setCategories] = useState([])
  const location = useLocation()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ active: true })
      if (response.success) {
        setCategories(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu()
  }, [location])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
      if (showProductsDropdown && !event.target.closest('.products-dropdown-container')) {
        setShowProductsDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu, showProductsDropdown])

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container" onClick={closeMobileMenu}>
          <img
            src="/logo.png"
            alt="MechHeaven Logo"
            className="logo"
            onError={(e) => {
              e.target.src = '/logo-new.png'
            }}
          />
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>HOME</Link>
          <div className="products-dropdown-container">
            <button 
              className="nav-link nav-link-btn products-dropdown-btn"
              onClick={(e) => {
                e.preventDefault()
                setShowProductsDropdown(!showProductsDropdown)
              }}
              onMouseEnter={() => setShowProductsDropdown(true)}
            >
              PRODUCTS
              <ChevronDown size={12} style={{ marginLeft: '0.5rem', transition: 'transform 0.3s', transform: showProductsDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {showProductsDropdown && (
              <div 
                className="products-dropdown"
                onMouseLeave={() => setShowProductsDropdown(false)}
              >
                <Link 
                  to="/products" 
                  className="dropdown-item" 
                  onClick={() => {
                    closeMobileMenu()
                    setShowProductsDropdown(false)
                  }}
                >
                  All Products
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category._id}
                    to={`/products?category=${category.slug}`} 
                    className="dropdown-item"
                    onClick={() => {
                      closeMobileMenu()
                      setShowProductsDropdown(false)
                    }}
                  >
                    {category.icon && <span style={{ marginRight: '0.5rem' }}>{category.icon}</span>}
                    {category.displayName}
                  </Link>
                ))}
                {categories.length === 0 && (
                  <>
                    <Link 
                      to="/products?category=smart-home" 
                      className="dropdown-item"
                      onClick={() => {
                        closeMobileMenu()
                        setShowProductsDropdown(false)
                      }}
                    >
                      Smart Home
                    </Link>
                    <Link 
                      to="/products?category=diy-kits" 
                      className="dropdown-item"
                      onClick={() => {
                        closeMobileMenu()
                        setShowProductsDropdown(false)
                      }}
                    >
                      DIY Kits
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link to="/cart" className="nav-link" onClick={closeMobileMenu}>CART</Link>
          <Link to="/checkout" className="nav-link" onClick={closeMobileMenu}>CHECKOUT</Link>
          {currentUser ? (
            <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>PROFILE</Link>
          ) : (
            <button
              className="nav-link nav-link-btn"
              onClick={() => {
                closeMobileMenu()
                setShowLoginModal(true)
              }}
            >
              LOGIN
            </button>
          )}
        </nav>

        <div className="header-icons">
          <button className="icon-btn categories-icon" aria-label="Categories">
            <Grid3x3 size={20} />
          </button>
          <button className="icon-btn search-icon" aria-label="Search">
            <Search size={20} />
          </button>
          <div className="user-menu-container">
            <button
              className="icon-btn user-icon"
              aria-label="User"
              onClick={() => {
                if (!currentUser) {
                  // If not logged in, open login modal directly
                  setShowLoginModal(true)
                } else {
                  // If logged in, toggle user menu
                  setShowUserMenu(!showUserMenu)
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            {showUserMenu && currentUser && (
              <div className="user-menu-dropdown">
                <div className="user-info">
                  <p className="user-email">{currentUser.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="profile-link-btn"
                  onClick={() => setShowUserMenu(false)}
                >
                  View Profile
                </Link>
                <button
                  className="logout-btn"
                  onClick={async () => {
                    await logout()
                    setShowUserMenu(false)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <Link to="/cart" className="icon-btn cart-icon">
            <ShoppingBag size={20} />
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Black & White Mode"
            title={isBlackWhite ? "Switch to Dark Mode" : "Switch to Black & White Mode"}
          >
            {isBlackWhite ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  )
}

export default Header

