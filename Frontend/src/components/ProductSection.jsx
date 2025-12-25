import { useRef } from 'react'
import ProductCard from './ProductCard'
import './ProductSection.css'

const ProductSection = ({ title, products, id }) => {
  const sectionRef = useRef(null)

  const scroll = (direction) => {
    if (sectionRef.current) {
      const scrollAmount = sectionRef.current.offsetWidth * 0.8
      sectionRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section id={id} className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
        <div className="section-controls">
          <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
            ‹
          </button>
          <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
            ›
          </button>
        </div>
      </div>
      <div className="products-container" ref={sectionRef}>
        {products.map(product => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductSection

