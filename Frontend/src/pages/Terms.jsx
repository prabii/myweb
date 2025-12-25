import { useEffect } from 'react'
import './Terms.css'

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="terms-page">
            <div className="terms-hero">
                <div className="container">
                    <h1>Terms & Conditions</h1>
                    <p className="hero-subtitle">Last updated: December 24, 2024</p>
                </div>
            </div>

            <div className="container">
                <div className="terms-content">
                    <section className="terms-section">
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            By accessing and using MechHeaven's website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>2. Use License</h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials on MechHeaven's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul>
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or public display</li>
                            <li>Attempt to reverse engineer any software contained on MechHeaven's website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2>3. Product Information</h2>
                        <p>
                            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>4. Pricing and Payment</h2>
                        <p>
                            All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to change prices at any time. Payment must be received before order processing. We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>5. Shipping and Delivery</h2>
                        <p>
                            We aim to process and ship orders within 1-2 business days. Delivery times vary based on location and shipping method selected. We are not responsible for delays caused by shipping carriers, customs, or circumstances beyond our control.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>6. Returns and Refunds</h2>
                        <p>
                            We offer a 7-day return policy for most products. Items must be unused, in original packaging, and with all tags attached. Certain items may be non-returnable. Refunds will be processed within 5-7 business days after we receive the returned item. Please refer to our Returns Policy for detailed information.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>7. User Accounts</h2>
                        <p>
                            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>8. Prohibited Uses</h2>
                        <p>
                            You may not use our website for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction. You must not transmit any worms, viruses, or any code of a destructive nature.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>9. Intellectual Property</h2>
                        <p>
                            The Service and its original content, features, and functionality are owned by MechHeaven and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>10. Limitation of Liability</h2>
                        <p>
                            In no event shall MechHeaven, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>11. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>12. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>13. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms and Conditions, please contact us at:
                        </p>
                        <ul>
                            <li>Email: legal@mechheaven.com</li>
                            <li>Phone: +91 1800-123-4567</li>
                            <li>Address: MechHeaven HQ, Bangalore, Karnataka, India</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Terms
