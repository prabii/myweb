import mongoose from 'mongoose'

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  link: {
    type: String
  },
  buttonText: {
    type: String,
    default: 'Shop Now'
  },
  position: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['banner', 'hero', 'category', 'promotion', 'testimonial', 'deal-of-day', 'night-owl', 'categories-section', 'featured-products'],
    default: 'banner'
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
})

sectionSchema.index({ position: 1 })
sectionSchema.index({ active: 1 })
sectionSchema.index({ type: 1 })

export default mongoose.model('Section', sectionSchema)
