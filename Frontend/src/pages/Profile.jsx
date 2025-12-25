import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, Wallet, CreditCard, User, Settings, Pencil, MapPin, Plus, Trash2 } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [addressForm, setAddressForm] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  })

  const loadOrdersFromLocalStorage = () => {
    if (!currentUser) return
    const allOrders = JSON.parse(localStorage.getItem('mechheaven_orders') || '[]')
    const userOrders = allOrders.filter(order => order.customer?.email === currentUser.email)
    setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)))
  }

  const fetchOrders = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      
      // Fetch orders for this customer by email
      const response = await fetch(`${API_URL}/orders/customer/${encodeURIComponent(currentUser.email)}`)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setOrders(data.data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)))
        } else {
          // Fallback to localStorage
          loadOrdersFromLocalStorage()
        }
      } else {
        // Fallback to localStorage
        loadOrdersFromLocalStorage()
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      // Fallback to localStorage
      loadOrdersFromLocalStorage()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
      return
    }

    // Load user profile data
    const userProfileKey = `mechheaven_profile_${currentUser.uid}`
    const savedProfile = localStorage.getItem(userProfileKey)
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile))
    }

    // Load addresses
    const addressesKey = `mechheaven_addresses_${currentUser.uid}`
    const savedAddresses = localStorage.getItem(addressesKey)
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }

    // Fetch orders from database
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate])

  // Refresh orders when orders tab is activated
  useEffect(() => {
    if (activeTab === 'orders' && currentUser) {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = () => {
    if (currentUser) {
      const userProfileKey = `mechheaven_profile_${currentUser.uid}`
      localStorage.setItem(userProfileKey, JSON.stringify(profileData))
      setEditing(false)
      alert('Profile updated successfully!')
    }
  }

  const saveAddresses = (newAddresses) => {
    if (currentUser) {
      const addressesKey = `mechheaven_addresses_${currentUser.uid}`
      localStorage.setItem(addressesKey, JSON.stringify(newAddresses))
      setAddresses(newAddresses)
    }
  }

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveAddress = () => {
    if (!addressForm.name.trim() || !addressForm.phone.trim() || !addressForm.address.trim() || 
        !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.pincode.trim()) {
      alert('Please fill all required fields')
      return
    }

    const newAddress = {
      id: editingAddress?.id || Date.now().toString(),
      label: addressForm.label || 'Home',
      name: addressForm.name,
      phone: addressForm.phone,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode
    }

    let updatedAddresses
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      )
    } else {
      updatedAddresses = [...addresses, newAddress]
    }

    saveAddresses(updatedAddresses)
    resetAddressForm()
    alert(editingAddress ? 'Address updated successfully!' : 'Address added successfully!')
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setAddressForm({
      label: address.label || '',
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || ''
    })
    setShowAddressForm(true)
  }

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId)
      saveAddresses(updatedAddresses)
      alert('Address deleted successfully!')
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      label: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    })
    setEditingAddress(null)
    setShowAddressForm(false)
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout()
      navigate('/')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOrderStatus = (order) => {
    // Use actual status from database
    const status = order.status || 'pending'
    
    const statusMap = {
      'pending': { text: 'Pending', color: '#95a5a6' },
      'processing': { text: 'Processing', color: '#3498db' },
      'confirmed': { text: 'Confirmed', color: '#2ecc71' },
      'shipped': { text: 'Shipped', color: '#f39c12' },
      'in-transit': { text: 'In Transit', color: '#9b59b6' },
      'delivered': { text: 'Delivered', color: '#27ae60' },
      'cancelled': { text: 'Cancelled', color: '#e74c3c' }
    }
    
    return statusMap[status] || statusMap['pending']
  }

  if (!currentUser) {
    return null
  }

  if (loading) {
    return (
      <div className="profile">
        <div className="profile-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-info-header">
            <h1>{profileData.name || currentUser.displayName || 'User'}</h1>
            <p className="profile-email">{currentUser.email}</p>
            <p className="profile-member-since">
              Member since {new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            📋 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Orders ({orders.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Addresses ({addresses.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!editing && (
                  <button className="edit-btn" onClick={() => setEditing(true)}>
                    <Pencil size={14} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {editing ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={currentUser.email} 
                      disabled 
                      className="disabled-input"
                    />
                    <small>Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>

                    <div className="form-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode"
                        maxLength="6"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{currentUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{profileData.name || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{profileData.phone || 'Not set'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">
                      {profileData.address || 'Not set'}
                      {profileData.city && `, ${profileData.city}`}
                      {profileData.state && `, ${profileData.state}`}
                      {profileData.pincode && ` - ${profileData.pincode}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-section">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <button className="shop-btn" onClick={() => navigate('/products')}>
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => {
                    const status = getOrderStatus(order)
                    return (
                      <div key={order._id || order.orderId} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order.orderId}</h3>
                            <p className="order-date">{formatDate(order.createdAt || order.date)}</p>
                          </div>
                          <div className="order-status" style={{ color: status.color }}>
                            <span className="status-dot" style={{ backgroundColor: status.color }}></span>
                            {status.text}
                          </div>
                        </div>

                        <div className="order-items">
                          <h4>Items ({order.items.length}):</h4>
                          <div className="items-list">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="item-image"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/60x60?text=Product'
                                  }}
                                />
                                <div className="item-details">
                                  <p className="item-name">{item.name}</p>
                                  <p className="item-quantity">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="item-total">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="order-footer">
                          <div className="order-total">
                            <span>Total Amount:</span>
                            <strong>₹{order.amount.toLocaleString('en-IN')}</strong>
                          </div>
                          <div className="order-payment">
                            <span>Payment:</span>
                            <span>
                              {order.paymentMethod === 'cod' ? (
                                <><Wallet size={16} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Cash on Delivery</>
                              ) : (
                                <><CreditCard size={16} style={{ marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} /> Online Payment</>
                              )}
                            </span>
                          </div>
                          <button 
                            className="view-order-btn"
                            onClick={() => navigate(`/order-success/${order.orderId}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Saved Addresses</h2>
                <button className="edit-btn" onClick={() => { resetAddressForm(); setShowAddressForm(true) }}>
                  <Plus size={14} />
                  <span>Add Address</span>
                </button>
              </div>

              {showAddressForm && (
                <div className="address-form-section">
                  <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                  <div className="form-group">
                    <label>Label (e.g., Home, Work) *</label>
                    <input
                      type="text"
                      name="label"
                      value={addressForm.label}
                      onChange={handleAddressInputChange}
                      placeholder="Home"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressInputChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Address *</label>
                    <textarea
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressInputChange}
                      placeholder="Enter complete address"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressInputChange}
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressInputChange}
                        placeholder="Enter state"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressInputChange}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button className="cancel-btn" onClick={resetAddressForm}>
                      Cancel
                    </button>
                    <button className="save-btn" onClick={handleSaveAddress}>
                      {editingAddress ? 'Update' : 'Save'} Address
                    </button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <div className="empty-addresses">
                  <MapPin size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3>No saved addresses</h3>
                  <p>Add an address to make checkout faster</p>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map((address) => (
                    <div key={address.id} className="address-card">
                      <div className="address-header">
                        <h4>{address.label || 'Address'}</h4>
                        <div className="address-actions">
                          <button 
                            className="edit-address-btn" 
                            onClick={() => handleEditAddress(address)}
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button 
                            className="delete-address-btn" 
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="address-details">
                        <p><strong>{address.name}</strong></p>
                        <p>{address.address}</p>
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section">
              <h2>Account Settings</h2>
              
              <div className="settings-section">
                <h3>Account Actions</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Logout</h4>
                      <p>Sign out from your account</p>
                    </div>
                    <button className="logout-setting-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Account Created:</span>
                    <span className="info-value">
                      {new Date(currentUser.metadata.creationTime).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Sign In:</span>
                    <span className="info-value">
                      {currentUser.metadata.lastSignInTime 
                        ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Never'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">User ID:</span>
                    <span className="info-value user-id">{currentUser.uid}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
