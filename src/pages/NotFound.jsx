import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, Heart, Mail } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="notfound-page">
            <div className="container">
                <div className="notfound-content">
                    <div className="error-code">404</div>
                    <h1>Page Not Found</h1>
                    <p className="error-message">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="notfound-actions">
                        <Link to="/" className="home-btn">
                            Go to Homepage
                        </Link>
                        <Link to="/products" className="products-btn">
                            Browse Products
                        </Link>
                    </div>
                    <div className="helpful-links">
                        <h3>You might be looking for:</h3>
                        <div className="links-grid">
                            <Link to="/cart" className="quick-link"><ShoppingCart size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> My Cart</Link>
                            <Link to="/profile" className="quick-link"><User size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> My Profile</Link>
                            <Link to="/wishlist" className="quick-link"><Heart size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Wishlist</Link>
                            <Link to="/contact" className="quick-link"><Mail size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
