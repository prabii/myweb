import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productsAPI } from '../utils/api'
import './Search.css'

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [results, setResults] = useState([])
    const [sortBy, setSortBy] = useState('relevance')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const query = searchParams.get('q') || ''
        setSearchQuery(query)
        performSearch(query)
    }, [searchParams])

    const performSearch = async (query) => {
        if (!query.trim()) {
            setResults([])
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await productsAPI.search(query)
            if (response.success) {
                setResults(response.data || [])
            } else {
                setResults([])
            }
        } catch (err) {
            console.error('Search error:', err)
            setError('Failed to search products. Please try again.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setSearchParams({ q: searchQuery })
        }
    }

    const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'rating':
                return (b.rating || 4.5) - (a.rating || 4.5)
            default:
                return 0
        }
    })

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="container">
                    <h1>Search Products</h1>
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="search-btn">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="container">
                {searchQuery && (
                    <div className="search-header">
                        <div className="search-info">
                            <h2>
                                {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                            </h2>
                        </div>
                        {results.length > 0 && (
                            <div className="search-controls">
                                <label htmlFor="sort">Sort by:</label>
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="sort-select"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="search-empty">
                        <div className="loading-spinner"></div>
                        <p>Searching...</p>
                    </div>
                ) : error ? (
                    <div className="search-empty">
                        <div className="empty-icon">⚠️</div>
                        <h2>{error}</h2>
                        <button onClick={() => performSearch(searchQuery)} className="browse-btn">Retry</button>
                    </div>
                ) : !searchQuery ? (
                    <div className="search-empty">
                        <div className="empty-icon">🔍</div>
                        <h2>Start searching</h2>
                        <p>Enter a keyword to find products</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="no-results">
                        <div className="empty-icon">😕</div>
                        <h2>No results found</h2>
                        <p>Try different keywords or browse our categories</p>
                        <Link to="/products" className="browse-btn">
                            Browse All Products
                        </Link>
                    </div>
                ) : (
                    <div className="results-grid">
                        {sortedResults.map((product) => {
                            const productId = product._id || product.id
                            return (
                            <Link
                                key={productId}
                                to={`/product/${productId}`}
                                className="result-card"
                            >
                                <div className="result-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="result-info">
                                    <h3>{product.name}</h3>
                                    <div className="result-rating">
                                        <span className="stars">★★★★★</span>
                                        <span className="rating-text">{product.rating || '4.5'}</span>
                                    </div>
                                    <div className="result-pricing">
                                        <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
                                        {product.discount && (
                                            <span className="discount">{product.discount}% OFF</span>
                                        )}
                                    </div>
                                    {product.freeDelivery && (
                                        <div className="free-delivery">✓ Free Delivery</div>
                                    )}
                                </div>
                            </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search
