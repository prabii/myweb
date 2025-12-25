const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    // Ensure we get all active products by default
    const defaultParams = { limit: 1000, ...params }
    const queryParams = new URLSearchParams(defaultParams).toString()
    return apiCall(`/products${queryParams ? `?${queryParams}` : ''}`)
  },
  getById: (id) => apiCall(`/products/${id}`),
  getFeatured: () => apiCall('/products?featured=true&limit=100'),
  getByCategory: (category) => apiCall(`/products?category=${category}&limit=1000`),
  search: (query) => apiCall(`/products?search=${encodeURIComponent(query)}&limit=1000`),
}

// Sections API
export const sectionsAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return apiCall(`/sections${queryParams ? `?${queryParams}` : ''}`)
  },
  getById: (id) => apiCall(`/sections/${id}`),
  getHero: () => apiCall('/sections?type=hero&active=true'),
  getByType: (type) => apiCall(`/sections?type=${type}&active=true`),
  getDealOfDay: () => apiCall('/sections?type=deal-of-day&active=true'),
  getNightOwl: () => apiCall('/sections?type=night-owl&active=true'),
  getCategories: () => apiCall('/sections?type=categories-section&active=true'),
}

// Coupons API
export const couponsAPI = {
  getAll: () => apiCall('/coupons?active=true'),
  getById: (id) => apiCall(`/coupons/${id}`),
  validate: (code, totalAmount) => apiCall('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, totalAmount })
  }),
  apply: (code, totalAmount) => apiCall('/coupons/apply', {
    method: 'POST',
    body: JSON.stringify({ code, totalAmount })
  }),
}

// Categories API
export const categoriesAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return apiCall(`/categories${queryParams ? `?${queryParams}` : ''}`)
  },
  getById: (id) => apiCall(`/categories/${id}`),
  getBySlug: (slug) => apiCall(`/categories?slug=${slug}&active=true`),
}

// Payments API
export const paymentsAPI = {
  createOrder: (amount, currency = 'INR', receipt) => 
    apiCall('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, receipt })
    }),
  verifyPayment: (orderId, paymentId, signature) =>
    apiCall('/payments/verify-payment', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentId, signature })
    }),
  getPayment: (paymentId) =>
    apiCall(`/payments/payment/${paymentId}`),
  getOrderPayments: (orderId) =>
    apiCall(`/payments/order/${orderId}/payments`),
}

export default {
  products: productsAPI,
  sections: sectionsAPI,
  coupons: couponsAPI,
  categories: categoriesAPI,
  payments: paymentsAPI,
}
