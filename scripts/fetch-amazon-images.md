# How to Get Amazon Product Images

To get actual product images from your Amazon storefront:

1. **Visit your Amazon storefront**: https://www.amazon.in/l/27943762031?me=A1RT1IT4PKQ0R0

2. **For each product**:
   - Right-click on the product image
   - Select "Copy image address" or "Copy image URL"
   - The URL will look like: `https://m.media-amazon.com/images/I/[IMAGE_ID]._AC_SL1500_.jpg`

3. **Update products.js**:
   - Replace the `image` field in each product object with the actual Amazon image URL
   - Or save images locally to `public/products/` folder and use `/products/[filename].jpg`

## Alternative: Using Amazon Product API

If you have Amazon Product Advertising API access, you can fetch product images programmatically using ASINs.

## Quick Method

1. Open your Amazon storefront
2. Inspect each product image element
3. Copy the image URL from the `src` attribute
4. Update the `image` field in `src/data/products.js`

