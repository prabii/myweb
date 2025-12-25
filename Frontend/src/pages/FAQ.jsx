import { useState, useEffect } from 'react'
import './FAQ.css'

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const faqData = [
        {
            category: 'Shipping & Delivery',
            questions: [
                {
                    q: 'What are the shipping charges?',
                    a: 'We offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping charge of ₹99 applies.'
                },
                {
                    q: 'How long does delivery take?',
                    a: 'Standard delivery takes 3-7 business days. Express delivery (available in select cities) takes 1-2 business days. You will receive tracking information once your order ships.'
                },
                {
                    q: 'Do you ship internationally?',
                    a: 'Currently, we only ship within India. We are working on expanding our services internationally. Stay tuned!'
                },
                {
                    q: 'Can I track my order?',
                    a: 'Yes! Once your order ships, you will receive a tracking number via email and SMS. You can also track your order from your profile page.'
                }
            ]
        },
        {
            category: 'Returns & Refunds',
            questions: [
                {
                    q: 'What is your return policy?',
                    a: 'We offer a 7-day return policy for most products. Items must be unused, in original packaging, and with all tags attached. DIY kits and opened electronic items may have different return policies.'
                },
                {
                    q: 'How do I initiate a return?',
                    a: 'Go to your profile, find the order, and click "Return Item". Follow the instructions to schedule a pickup. Our team will review and process your refund within 5-7 business days.'
                },
                {
                    q: 'When will I receive my refund?',
                    a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.'
                },
                {
                    q: 'Are there any items that cannot be returned?',
                    a: 'Yes, opened DIY kits, personalized items, and products marked as "non-returnable" cannot be returned unless they are defective or damaged.'
                }
            ]
        },
        {
            category: 'Payment',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. We use Razorpay for secure payment processing.'
                },
                {
                    q: 'Is it safe to use my credit card?',
                    a: 'Absolutely! We use industry-standard SSL encryption and Razorpay\'s secure payment gateway. We never store your card details on our servers.'
                },
                {
                    q: 'Can I pay cash on delivery?',
                    a: 'Cash on Delivery (COD) is available for orders below ₹10,000. A nominal COD fee of ₹50 applies.'
                },
                {
                    q: 'Do you offer EMI options?',
                    a: 'Yes, we offer EMI options on orders above ₹5,000 through select credit cards and digital payment providers.'
                }
            ]
        },
        {
            category: 'Products',
            questions: [
                {
                    q: 'Are your products genuine?',
                    a: 'Yes, all our products are 100% genuine and sourced directly from authorized distributors and manufacturers.'
                },
                {
                    q: 'Do you provide warranty?',
                    a: 'Yes, all electronic products come with manufacturer warranty. Warranty period varies by product and is mentioned on the product page.'
                },
                {
                    q: 'Can I get product recommendations?',
                    a: 'Of course! You can reach out to our customer support team via chat, email, or phone, and we\'ll help you find the perfect product for your needs.'
                },
                {
                    q: 'Are DIY kits suitable for beginners?',
                    a: 'Yes! Each DIY kit comes with detailed instructions and all necessary components. We also have difficulty ratings to help you choose the right kit for your skill level.'
                }
            ]
        },
        {
            category: 'Account & Orders',
            questions: [
                {
                    q: 'Do I need an account to place an order?',
                    a: 'While you can browse as a guest, creating an account allows you to track orders, save addresses, maintain a wishlist, and enjoy a faster checkout experience.'
                },
                {
                    q: 'How do I reset my password?',
                    a: 'Click on the "Login" button, then select "Forgot Password". Enter your registered email, and we\'ll send you a password reset link.'
                },
                {
                    q: 'Can I cancel my order?',
                    a: 'Yes, you can cancel your order before it ships. Go to your profile, find the order, and click "Cancel Order". Once shipped, you\'ll need to follow the return process.'
                },
                {
                    q: 'How do I update my shipping address?',
                    a: 'You can update your shipping address from your profile page. For an order already placed, contact our support team immediately if the order hasn\'t shipped yet.'
                }
            ]
        }
    ]

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const filteredFAQs = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(item =>
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0)

    return (
        <div className="faq-page">
            <div className="faq-hero">
                <div className="container">
                    <h1>Frequently Asked Questions</h1>
                    <p className="hero-subtitle">Find answers to common questions</p>
                </div>
            </div>

            <div className="container">
                <div className="search-section">
                    <input
                        type="text"
                        className="faq-search"
                        placeholder="Search for answers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="faq-content">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((category, catIndex) => (
                            <div key={catIndex} className="faq-category">
                                <h2 className="category-title">{category.category}</h2>
                                <div className="faq-list">
                                    {category.questions.map((item, qIndex) => {
                                        const globalIndex = `${catIndex}-${qIndex}`
                                        return (
                                            <div
                                                key={qIndex}
                                                className={`faq-item ${activeIndex === globalIndex ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="faq-question"
                                                    onClick={() => toggleAccordion(globalIndex)}
                                                >
                                                    <span>{item.q}</span>
                                                    <span className="faq-icon">
                                                        {activeIndex === globalIndex ? '−' : '+'}
                                                    </span>
                                                </button>
                                                <div className="faq-answer">
                                                    <p>{item.a}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <p>No questions found matching "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm('')} className="clear-search">
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>

                <div className="faq-cta">
                    <h2>Still have questions?</h2>
                    <p>Can't find what you're looking for? Our support team is here to help!</p>
                    <a href="/contact" className="contact-btn">Contact Support</a>
                </div>
            </div>
        </div>
    )
}

export default FAQ
