import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider, useCart } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CartPopup from './components/CartPopup'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import './App.css'

function AppContent() {
  const { showCartPopup, closeCartPopup, lastAddedProduct } = useCart()
  
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        </Routes>
      </main>
      <Footer />
      <CartPopup 
        isOpen={showCartPopup} 
        onClose={closeCartPopup}
        lastAddedProduct={lastAddedProduct}
      />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App

