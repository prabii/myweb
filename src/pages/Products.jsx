import { useEffect } from 'react'
import ProductSection from '../components/ProductSection'
import { products } from '../data/products'
import './Products.css'

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>All Products</h1>
        <p>Browse our complete collection of smart home products and DIY kits</p>
      </div>
      <ProductSection 
        title="All Products" 
        products={products}
        id="all-products"
      />
    </div>
  )
}

export default Products

