import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    trim: true
  },
  phone: {
    type: String
  },
  addresses: [{
    label: String,
    name: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  }],
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrderDate: {
    type: Date
  },
  metadata: {
    firebaseUid: String,
    createdAt: Date,
    lastSignIn: Date
  }
}, {
  timestamps: true
})

// Indexes
customerSchema.index({ email: 1 })
customerSchema.index({ 'metadata.firebaseUid': 1 })

export default mongoose.model('Customer', customerSchema)
