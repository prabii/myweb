import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  icon: {
    type: String
  },
  position: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
})

categorySchema.index({ slug: 1 })
categorySchema.index({ active: 1 })
categorySchema.index({ position: 1 })

export default mongoose.model('Category', categorySchema)
