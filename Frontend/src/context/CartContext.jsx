import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem('mechheaven_cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      // Save cart for logged-in user
      const userCartKey = `mechheaven_cart_${currentUser.uid}`
      localStorage.setItem(userCartKey, JSON.stringify(cartItems))
      localStorage.setItem('mechheaven_cart', JSON.stringify(cartItems))
    } else {
    localStorage.setItem('mechheaven_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, currentUser])

  useEffect(() => {
    // Load user-specific cart when user logs in
    if (currentUser) {
      const userCartKey = `mechheaven_cart_${currentUser.uid}`
      const savedUserCart = localStorage.getItem(userCartKey)
      if (savedUserCart) {
        setCartItems(JSON.parse(savedUserCart))
      }
    }
  }, [currentUser])

  const addToCart = (product) => {
    // Check if user is logged in
    if (!currentUser) {
      setShowLoginModal(true)
      return
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      let updatedItems
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedItems = [...prevItems, { ...product, quantity: 1 }]
      }
      // Show popup with the product that was added/updated
      const addedItem = updatedItems.find(item => item.id === product.id)
      setLastAddedProduct(addedItem)
      setShowCartPopup(true)
      return updatedItems
    })
  }

  const closeCartPopup = () => {
    setShowCartPopup(false)
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        showCartPopup,
        closeCartPopup,
        lastAddedProduct,
        showLoginModal,
        setShowLoginModal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

