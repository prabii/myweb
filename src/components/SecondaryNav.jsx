import { Link } from 'react-router-dom'
import './SecondaryNav.css'

const SecondaryNav = () => {
  return (
    <nav className="secondary-nav">
      <div className="secondary-nav-container">
        <div className="secondary-nav-links">
          <Link to="/products" className="secondary-nav-link">All Products</Link>
          <Link to="/#smart-home" className="secondary-nav-link">Smart Home</Link>
          <Link to="/#diy-kits" className="secondary-nav-link">DIY Kits</Link>
          <Link to="/#categories" className="secondary-nav-link">Categories</Link>
        </div>
      </div>
    </nav>
  )
}

export default SecondaryNav

