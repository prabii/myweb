# How to Add Amazon Product Images

## Quick Method

1. **Visit your Amazon storefront**: 
   https://www.amazon.in/l/27943762031?me=A1RT1IT4PKQ0R0&tag=ShopReferral_48082f62-090d-4d2f-9bfa-ad9fd5b205a4&ref=sf_seller_app_share_new_ls_srb

2. **For each product**:
   - Right-click on the product image
   - Select "Copy image address" or "Copy image URL"
   - The URL format will be: `https://m.media-amazon.com/images/I/[IMAGE_ID]._AC_SL1500_.jpg`

3. **Update `src/data/products.js`**:
   - Find the product by ID
   - Replace the `image` field with the actual Amazon image URL
   - Also update the `amazonUrl` field with the product's Amazon page URL

## Example

```javascript
{
  id: 1,
  name: "MechHeaven The Robot Vacuum Cleaner Multifunctional",
  // ... other fields
  image: "https://m.media-amazon.com/images/I/71XQY5JZz5L._AC_SL1500_.jpg", // ← Replace this
  amazonUrl: "https://www.amazon.in/dp/B08XXXXXXX" // ← Add actual Amazon URL
}
```

## Alternative: Download Images Locally

1. Download product images from Amazon
2. Save them to `public/products/` folder
3. Name them: `product-1.jpg`, `product-2.jpg`, etc.
4. Update `src/data/products.js`:
   ```javascript
   image: "/products/product-1.jpg"
   ```

## Getting Product URLs

To get the Amazon product URL:
1. Click on the product on your storefront
2. Copy the URL from the browser address bar
3. Update the `amazonUrl` field in `src/data/products.js`

## Notes

- Amazon image URLs are typically in format: `https://m.media-amazon.com/images/I/[IMAGE_ID]._AC_SL1500_.jpg`
- The `_AC_SL1500_` part can vary (e.g., `_AC_SX679_`, `_AC_UL1500_`)
- Use the highest resolution available for best quality
- Images will load directly from Amazon's CDN

