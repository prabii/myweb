import { useEffect } from 'react'
import './Privacy.css'

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="privacy-page">
            <div className="privacy-hero">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="hero-subtitle">Last updated: December 24, 2024</p>
                </div>
            </div>

            <div className="container">
                <div className="privacy-content">
                    <section className="privacy-section">
                        <h2>1. Introduction</h2>
                        <p>
                            At MechHeaven, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>2. Information We Collect</h2>
                        <h3>Personal Information</h3>
                        <p>We may collect personal information that you voluntarily provide to us when you:</p>
                        <ul>
                            <li>Register on the website</li>
                            <li>Place an order</li>
                            <li>Subscribe to our newsletter</li>
                            <li>Contact customer support</li>
                            <li>Participate in surveys or promotions</li>
                        </ul>
                        <p>This information may include:</p>
                        <ul>
                            <li>Name and contact information (email, phone number, address)</li>
                            <li>Payment information (processed securely through third-party payment processors)</li>
                            <li>Order history and preferences</li>
                            <li>Account credentials</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your orders and account</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and enhance security</li>
                            <li>Comply with legal obligations</li>
                            <li>Analyze usage patterns and trends</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Information Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your information with:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Third-party companies that help us operate our business (payment processors, shipping companies, email service providers)</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Data Security</h2>
                        <p>
                            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Cookies and Tracking Technologies</h2>
                        <p>
                            We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, analyze site traffic, and personalize content. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Your Privacy Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to processing of your personal information</li>
                            <li>Request data portability</li>
                        </ul>
                        <p>To exercise these rights, please contact us at privacy@mechheaven.com</p>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Children's Privacy</h2>
                        <p>
                            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Third-Party Links</h2>
                        <p>
                            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any information.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>10. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>11. Changes to This Privacy Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>12. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy, please contact us at:
                        </p>
                        <ul>
                            <li>Email: privacy@mechheaven.com</li>
                            <li>Phone: +91 1800-123-4567</li>
                            <li>Address: MechHeaven HQ, Bangalore, Karnataka, India</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Privacy
