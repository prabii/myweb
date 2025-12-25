import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Home, Grid3x3, Heart, ShoppingBag, User } from 'lucide-react'
import './BottomNav.css'

const BottomNav = () => {
  const location = useLocation()
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      <Link
        to="/products"
        className={`bottom-nav-item ${isActive('/products') ? 'active' : ''}`}
      >
        <Grid3x3 size={24} />
        <span>Products</span>
      </Link>

      <Link
        to="/wishlist"
        className={`bottom-nav-item ${isActive('/wishlist') ? 'active' : ''}`}
      >
        <div className="bottom-nav-cart-wrapper">
          <Heart size={24} fill={isActive('/wishlist') ? 'currentColor' : 'none'} strokeWidth={2} />
          {getWishlistCount() > 0 && (
            <span className="bottom-nav-badge">{getWishlistCount()}</span>
          )}
        </div>
        <span>Wishlist</span>
      </Link>

      <Link
        to="/cart"
        className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}
      >
        <div className="bottom-nav-cart-wrapper">
          <ShoppingBag size={24} />
          {getCartCount() > 0 && (
            <span className="bottom-nav-badge">{getCartCount()}</span>
          )}
        </div>
        <span>Cart</span>
      </Link>

      <Link
        to="/profile"
        className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        <User size={24} />
        <span>Account</span>
      </Link>
    </nav>
  )
}

export default BottomNav

