import { useEffect } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import './Wishlist.css'

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleAddToCart = (product) => {
        addToCart(product)
    }

    const handleRemove = (productId) => {
        removeFromWishlist(productId)
    }

    return (
        <div className="wishlist-page">
            <div className="wishlist-hero">
                <div className="container">
                    <h1>My Wishlist</h1>
                    <p className="hero-subtitle">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </div>

            <div className="container">
                {wishlistItems.length === 0 ? (
                    <div className="empty-wishlist">
                        <div className="empty-icon">💝</div>
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love to buy them later</p>
                        <Link to="/products" className="shop-btn">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="wishlist-card">
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(product.id)}
                                    aria-label="Remove from wishlist"
                                >
                                    ×
                                </button>
                                <Link to={`/product/${product.id}`} className="product-link">
                                    <div className="product-image">
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <div className="product-rating">
                                            <span className="stars">★★★★★</span>
                                            <span className="rating-text">{product.rating || '4.5'}</span>
                                        </div>
                                        <div className="product-pricing">
                                            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                                            {product.discount && (
                                                <span className="discount">{product.discount}% OFF</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
