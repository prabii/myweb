# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   The app will automatically open at `http://localhost:3000`

## Updating Product Images

Currently, the products use placeholder images from Unsplash. To use actual product images from your Amazon storefront:

1. Visit your Amazon storefront and download product images
2. Save images to `public/products/` folder
3. Update `src/data/products.js` with the correct image paths:
   ```javascript
   image: "/products/product-name.jpg"
   ```

## Customizing Products

Edit `src/data/products.js` to:
- Add new products
- Update prices and discounts
- Modify product descriptions
- Change categories

## Styling Customization

Edit CSS variables in `src/index.css` to customize:
- Colors (primary, secondary, text)
- Shadows
- Border colors
- Background colors

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy to any static hosting service.

