import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null // null means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  applicableCategories: [{
    type: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
})

// Indexes
couponSchema.index({ code: 1 }, { unique: true })
couponSchema.index({ active: 1 })
couponSchema.index({ startDate: 1, endDate: 1 })

// Method to check if coupon is valid
couponSchema.methods.isValid = function(totalAmount = 0) {
  const now = new Date()
  
  if (!this.active) return { valid: false, message: 'Coupon is not active' }
  if (now < this.startDate) return { valid: false, message: 'Coupon has not started yet' }
  if (now > this.endDate) return { valid: false, message: 'Coupon has expired' }
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' }
  }
  if (this.minPurchase > 0 && totalAmount < this.minPurchase) {
    return { valid: false, message: `Invalid order amount. Minimum purchase of ₹${this.minPurchase} required` }
  }
  
  return { valid: true }
}

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(totalAmount) {
  let discount = 0
  
  if (this.discountType === 'percentage') {
    discount = (totalAmount * this.discountValue) / 100
    if (this.maxDiscount) {
      discount = Math.min(discount, this.maxDiscount)
    }
  } else {
    discount = Math.min(this.discountValue, totalAmount)
  }
  
  return Math.round(discount * 100) / 100 // Round to 2 decimal places
}

export default mongoose.model('Coupon', couponSchema)
