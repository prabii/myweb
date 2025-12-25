// Utility to get Amazon product images
// Amazon image URL pattern: https://m.media-amazon.com/images/I/[IMAGE_ID]._AC_SL1500_.jpg
// For now, using placeholder images. Replace with actual Amazon product image URLs

export const getAmazonImageUrl = (asin, imageId) => {
  if (imageId) {
    return `https://m.media-amazon.com/images/I/${imageId}._AC_SL1500_.jpg`
  }
  // Fallback to placeholder
  return null
}

// Product image mapping - Update these with actual Amazon product image IDs
export const productImages = {
  // Popular Products
  1: 'https://m.media-amazon.com/images/I/71XQY5JZz5L._AC_SL1500_.jpg', // Robot Vacuum - placeholder
  2: 'https://m.media-amazon.com/images/I/81KQ5JZz5L._AC_SL1500_.jpg', // Book Nook Japanese
  3: 'https://m.media-amazon.com/images/I/81LQ5JZz5L._AC_SL1500_.jpg', // Book Nook Blossom
  4: 'https://m.media-amazon.com/images/I/81MQ5JZz5L._AC_SL1500_.jpg', // Book Nook Greenhouse
  5: 'https://m.media-amazon.com/images/I/81NQ5JZz5L._AC_SL1500_.jpg', // Dollhouse Multi-level
  
  // Latest Arrivals
  6: 'https://m.media-amazon.com/images/I/81OQ5JZz5L._AC_SL1500_.jpg', // Egg Storage
  7: 'https://m.media-amazon.com/images/I/81PQ5JZz5L._AC_SL1500_.jpg', // Makeup Organizer
  8: 'https://m.media-amazon.com/images/I/81QQ5JZz5L._AC_SL1500_.jpg', // Backpack
  9: 'https://m.media-amazon.com/images/I/81RQ5JZz5L._AC_SL1500_.jpg', // Laundry Storage
  10: 'https://m.media-amazon.com/images/I/81SQ5JZz5L._AC_SL1500_.jpg', // Waterproof Bag
  11: 'https://m.media-amazon.com/images/I/81TQ5JZz5L._AC_SL1500_.jpg', // Trolly Storage
  12: 'https://m.media-amazon.com/images/I/81UQ5JZz5L._AC_SL1500_.jpg', // Storage Cabinet
  13: 'https://m.media-amazon.com/images/I/81VQ5JZz5L._AC_SL1500_.jpg', // Baby Walker
  14: 'https://m.media-amazon.com/images/I/81WQ5JZz5L._AC_SL1500_.jpg', // Wall Mount
  15: 'https://m.media-amazon.com/images/I/81XQ5JZz5L._AC_SL1500_.jpg', // Lattice Hamper
}

