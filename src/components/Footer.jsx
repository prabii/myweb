import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p>&copy; 2025 MechHeaven. All rights reserved.</p>
        </div>
        <div className="footer-right">
          <a href="/#about">About</a>
          <a href="/#shipping">Shipping & Returns</a>
          <a href="/#help">Help Center</a>
          <a href="/#privacy">Privacy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

