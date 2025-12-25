import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb+srv://DB_ECOM:${encodeURIComponent('prabhas@123$')}@ecom.cl9lzmi.mongodb.net/mechheaven?retryWrites=true&w=majority`

const staticProducts = [
  {
    name: "MechHeaven The Robot Vacuum Cleaner Multifunctional",
    brand: "MechHeaven",
    price: 1899,
    originalPrice: 4999,
    discount: 62,
    rating: 3.0,
    reviews: 2,
    category: "electronics",
    image: "https://m.media-amazon.com/images/I/511E+kkkpUL._AC_SL1500_.jpg",
    description: "Multifunctional robot vacuum cleaner with advanced cleaning technology.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 50,
    featured: true,
    active: true
  },
  {
    name: "CUTEBEE Book Nook Kit - DIY Miniature House Dollhouse Japanese Style",
    brand: "CUTEBEE",
    price: 5499,
    originalPrice: 15999,
    discount: 66,
    rating: 4.6,
    reviews: 38,
    category: "hobbies",
    image: "https://m.media-amazon.com/images/I/71TEmUTZ2lL._AC_SL1500_.jpg",
    description: "DIY miniature house kit with Japanese-style design, perfect for book nooks.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 30,
    featured: true,
    active: true
  },
  {
    name: "CUTEBEE Book Nook Kit - DIY Miniature House Dollhouse Blossom Florists",
    brand: "CUTEBEE",
    price: 4999,
    originalPrice: 18999,
    discount: 74,
    rating: 4.2,
    reviews: 19,
    category: "hobbies",
    image: "https://m.media-amazon.com/images/I/81MSdWYmheL._AC_SL1500_.jpg",
    description: "Beautiful Blossom Florists miniature kit with detailed accessories.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 25,
    featured: true,
    active: true
  },
  {
    name: "CUTEBEE Book Nook Kit - DIY Miniature House Dollhouse Greenhouse",
    brand: "CUTEBEE",
    price: 4999,
    originalPrice: 14999,
    discount: 67,
    rating: 4.7,
    reviews: 82,
    category: "hobbies",
    image: "https://m.media-amazon.com/images/I/61+bU33hpZL._AC_SL1500_.jpg",
    description: "Elegant greenhouse/orangery miniature kit with intricate details.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 40,
    featured: true,
    active: true
  },
  {
    name: "CUTEBEE DIY Dollhouse Miniature Kit, DIY Wooden Multi-level",
    brand: "CUTEBEE",
    price: 5999,
    originalPrice: 18999,
    discount: 68,
    rating: 4.1,
    reviews: 93,
    category: "hobbies",
    image: "https://m.media-amazon.com/images/I/51CpyRMu6JL._AC_SL1500_.jpg",
    description: "Multi-level dollhouse miniature kit with spiral staircase and detailed rooms.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 35,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven Modern Egg Storage Organizer",
    brand: "MechHeaven",
    price: 229,
    originalPrice: 1799,
    discount: 87,
    rating: 4.5,
    reviews: 45,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/51pOynPuQtL._AC_SL1500_.jpg",
    description: "Modern two-tiered egg dispenser for organized refrigerator storage.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 100,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven's Luxury Makeup Organizer",
    brand: "MechHeaven",
    price: 1499,
    originalPrice: 4499,
    discount: 67,
    rating: 4.3,
    reviews: 28,
    category: "beauty",
    image: "https://m.media-amazon.com/images/I/61gyPLoU7YL._AC_SL1500_.jpg",
    description: "Stylish two-tiered makeup organizer with clear domed lid and golden feet.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/MechHeaven-Counter-Cosmetic-Storage-Perfume/dp/B0G35M9J5D/",
    stock: 60,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven Vintage Style PU Leather Backpack",
    brand: "MechHeaven",
    price: 1799,
    originalPrice: 4999,
    discount: 64,
    rating: 4.4,
    reviews: 67,
    category: "fashion",
    image: "https://m.media-amazon.com/images/I/61HYljKCShL._AC_SL1500_.jpg",
    description: "Vintage-style PU leather backpack with buckle closures and multiple pockets.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 45,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven DOUBA Collapsible Laundry Storage",
    brand: "MechHeaven",
    price: 899,
    originalPrice: 2199,
    discount: 59,
    rating: 4.6,
    reviews: 52,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/41TkfYhyBzL._AC_SL1500_.jpg",
    description: "Collapsible laundry hamper on wheels with perforated design and lid.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 80,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven Men's Fashion Waterproof Light Weight Bag",
    brand: "MechHeaven",
    price: 699,
    originalPrice: 2499,
    discount: 72,
    rating: 4.2,
    reviews: 34,
    category: "fashion",
    image: "https://m.media-amazon.com/images/I/61BXPbidCJL._AC_SL1500_.jpg",
    description: "Waterproof lightweight sling bag with combination lock and fashion design.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 70,
    featured: true,
    active: true
  },
  {
    name: "2/3 Layer Trolly Storage",
    brand: "MechHeaven",
    price: 2999,
    originalPrice: 6999,
    discount: 57,
    rating: 4.5,
    reviews: 41,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/41FhwRj78YL._AC_SL1500_.jpg",
    description: "Multi-tiered storage trolley on wheels with perforated basket shelves.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 55,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven 5 Layer Modern Home Storage Cabinet",
    brand: "MechHeaven",
    price: 4999,
    originalPrice: 14999,
    discount: 67,
    rating: 4.7,
    reviews: 89,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/61oE5q6aLFL._AC_SL1500_.jpg",
    description: "Tall storage cabinet with five transparent drawers in minimalist design.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 40,
    featured: true,
    active: true
  },
  {
    name: "Space Explorer Baby Walker, BPA-Free Plastic Multi-Functional",
    brand: "MechHeaven",
    price: 8999,
    originalPrice: 19999,
    discount: 55,
    rating: 4.8,
    reviews: 156,
    category: "baby",
    image: "https://m.media-amazon.com/images/I/511E+kkkpUL._AC_SL1500_.jpg",
    description: "Colorful multi-functional baby walker with interactive elements and wheels.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 30,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven's 360-Degree Rotating Wall Mount",
    brand: "MechHeaven",
    price: 1149,
    originalPrice: 2499,
    discount: 54,
    rating: 4.4,
    reviews: 73,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/71TEmUTZ2lL._AC_SL1500_.jpg",
    description: "Corner shelf with rotating tray and hooks for bathroom or kitchen.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 65,
    featured: true,
    active: true
  },
  {
    name: "MechHeaven Modern Lattice Laundry Hamper",
    brand: "MechHeaven",
    price: 999,
    originalPrice: 2399,
    discount: 58,
    rating: 4.3,
    reviews: 61,
    category: "home-kitchen",
    image: "https://m.media-amazon.com/images/I/81MSdWYmheL._AC_SL1500_.jpg",
    description: "Cream-colored laundry hamper with lattice pattern and wheels.",
    delivery: "Free delivery",
    amazonUrl: "https://www.amazon.in/dp/[ASIN]",
    stock: 75,
    featured: true,
    active: true
  }
]

async function importProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    console.log(`📦 Starting import of ${staticProducts.length} products...\n`)

    let created = 0
    let skipped = 0
    let errors = 0

    for (const productData of staticProducts) {
      try {
        // Check if product already exists (by name)
        const existing = await Product.findOne({ name: productData.name })
        
        if (existing) {
          console.log(`⏭️  Skipped: "${productData.name}" (already exists)`)
          skipped++
          continue
        }

        // Create new product
        const product = new Product(productData)
        await product.save()
        
        console.log(`✅ Created: "${productData.name}"`)
        created++
      } catch (error) {
        console.error(`❌ Error creating "${productData.name}":`, error.message)
        errors++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📊 Import Summary:')
    console.log(`   ✅ Created: ${created}`)
    console.log(`   ⏭️  Skipped: ${skipped}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`   📦 Total: ${staticProducts.length}`)
    console.log('='.repeat(50))

    await mongoose.connection.close()
    console.log('\n✅ Import completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

importProducts()
