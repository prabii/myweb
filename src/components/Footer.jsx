import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Send, Check } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      console.log('Subscribed:', email)
      setSubscribed(true)
      setTimeout(() => {
        setSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>MechHeaven</h3>
          <p className="footer-description">
            Your trusted destination for smart home solutions and creative DIY kits.
            Transforming houses into intelligent, beautiful homes.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/faq">Shipping & Returns</Link></li>
            <li><Link to="/contact">Help Center</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section newsletter-section">
          <h3>Newsletter</h3>
          <p className="newsletter-text">Subscribe to get special offers and updates</p>
          {subscribed ? (
            <div className="subscribe-success">
              <Check size={16} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} />
              Subscribed successfully!
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                <Send size={16} style={{ marginRight: '0.5rem' }} />
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2025 MechHeaven. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

