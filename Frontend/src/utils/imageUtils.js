/**
 * Utility functions for handling product images
 */

/**
 * Normalize Amazon image URL to ensure proper format
 * @param {string} url - Amazon image URL
 * @returns {string} - Normalized URL
 */
export const normalizeAmazonImageUrl = (url) => {
  if (!url) return null
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If it's a relative path, return as is
  if (url.startsWith('/')) {
    return url
  }
  
  // If it's an Amazon image ID, construct full URL
  if (url.includes('media-amazon.com')) {
    return url
  }
  
  return url
}

/**
 * Get fallback image URL
 * @returns {string} - Placeholder image URL
 */
export const getFallbackImage = () => {
  return 'https://via.placeholder.com/400x300?text=Product+Image'
}

/**
 * Check if image URL is valid
 * @param {string} url - Image URL
 * @returns {boolean} - True if URL is valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false
  
  try {
    new URL(url)
    return true
  } catch {
    // If it's a relative path, it's valid
    return url.startsWith('/')
  }
}

/**
 * Proxy Amazon image URL to avoid CORS issues (if needed)
 * Note: This requires a backend proxy server
 * @param {string} url - Amazon image URL
 * @returns {string} - Proxied URL
 */
export const proxyAmazonImage = (url) => {
  // If you have a backend proxy, use it here
  // Example: return `/api/proxy-image?url=${encodeURIComponent(url)}`
  return url
}

