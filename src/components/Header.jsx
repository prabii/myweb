import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import './Header.css'

const Header = () => {
  const { getCartCount } = useCart()
  const { isBlackWhite, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

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
        
        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>HOME</Link>
          <Link to="/products" className="nav-link" onClick={closeMobileMenu}>PRODUCTS</Link>
          <Link to="/cart" className="nav-link" onClick={closeMobileMenu}>CART</Link>
          <Link to="/checkout" className="nav-link" onClick={closeMobileMenu}>CHECKOUT</Link>
          <Link to="/#smart-home" className="nav-link" onClick={closeMobileMenu}>SMART HOME</Link>
          <Link to="/#diy-kits" className="nav-link" onClick={closeMobileMenu}>DIY KITS</Link>
          <Link to="/#support" className="nav-link" onClick={closeMobileMenu}>SUPPORT</Link>
        </nav>

        <div className="header-icons">
          <button 
            className="icon-btn theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle Black & White Mode"
            title={isBlackWhite ? "Switch to Dark Mode" : "Switch to Black & White Mode"}
          >
            {isBlackWhite ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                <rect x="6" y="6" width="12" height="12" rx="1" ry="1"></rect>
              </svg>
            )}
          </button>
          <button className="icon-btn search-icon" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button className="icon-btn user-icon" aria-label="User">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          <Link to="/cart" className="icon-btn cart-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2L6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="9" y1="2" x2="15" y2="2"></line>
              <path d="M6 6h12"></path>
            </svg>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  )
}

export default Header

