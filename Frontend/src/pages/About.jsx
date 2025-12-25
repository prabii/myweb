import { useEffect } from 'react'
import './About.css'

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="about-page">
            <div className="about-hero">
                <div className="container">
                    <h1>About MechHeaven</h1>
                    <p className="hero-subtitle">Transforming Houses into Smart Homes</p>
                </div>
            </div>

            <div className="container">
                <section className="about-section">
                    <div className="section-content">
                        <h2>Our Story</h2>
                        <p>
                            Founded with a passion for innovation and creativity, MechHeaven has become a trusted destination for smart home solutions and DIY enthusiasts. We believe that every home deserves to be both intelligent and beautiful.
                        </p>
                        <p>
                            From cutting-edge robot vacuums to enchanting miniature book nook kits, we curate products that bring joy, efficiency, and creativity to your living space. Our mission is to make smart living accessible to everyone.
                        </p>
                    </div>
                    <div className="section-image">
                        <div className="image-placeholder">
                            <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none">
                                <rect width="400" height="300" fill="var(--dark-card)" />
                                <path d="M200 100L250 150L200 200L150 150L200 100Z" fill="var(--gold)" opacity="0.3" />
                                <circle cx="200" cy="150" r="60" stroke="var(--gold)" strokeWidth="2" fill="none" />
                                <text x="200" y="260" textAnchor="middle" fill="var(--gold)" fontSize="16" fontWeight="600">Innovation</text>
                            </svg>
                        </div>
                    </div>
                </section>

                <section className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🎯</div>
                            <h3>Quality First</h3>
                            <p>We carefully select every product to ensure it meets our high standards of quality and functionality.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">💡</div>
                            <h3>Innovation</h3>
                            <p>We stay ahead of trends to bring you the latest in smart home technology and creative DIY solutions.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h3>Customer Focus</h3>
                            <p>Your satisfaction is our priority. We provide exceptional service and support at every step.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🌟</div>
                            <h3>Creativity</h3>
                            <p>We celebrate imagination and provide tools that help you express your unique style and vision.</p>
                        </div>
                    </div>
                </section>

                <section className="stats-section">
                    <div className="stats-grid">
                        <div className="stat-box">
                            <div className="stat-number">25,000+</div>
                            <div className="stat-label">Happy Customers</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Products</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">4.8/5</div>
                            <div className="stat-label">Average Rating</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">48hr</div>
                            <div className="stat-label">Fast Delivery</div>
                        </div>
                    </div>
                </section>

                <section className="mission-section">
                    <h2>Our Mission</h2>
                    <div className="mission-content">
                        <p>
                            At MechHeaven, we're on a mission to make every home smarter, more efficient, and more beautiful. We believe that technology should enhance your life, not complicate it. That's why we offer products that are:
                        </p>
                        <ul className="mission-list">
                            <li>✓ Easy to use and integrate into your daily routine</li>
                            <li>✓ Designed with both form and function in mind</li>
                            <li>✓ Backed by excellent customer support</li>
                            <li>✓ Competitively priced without compromising quality</li>
                            <li>✓ Environmentally conscious and sustainable</li>
                        </ul>
                    </div>
                </section>

                <section className="cta-section">
                    <h2>Join the MechHeaven Family</h2>
                    <p>Experience the future of smart living today</p>
                    <div className="cta-buttons">
                        <a href="/products" className="cta-btn primary">Shop Now</a>
                        <a href="/contact" className="cta-btn secondary">Contact Us</a>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default About
