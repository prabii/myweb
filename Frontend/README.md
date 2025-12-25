# MechHeaven E-commerce Store

A modern, responsive e-commerce website for MechHeaven - "Your Vision, Our Innovation"

## Features

- 🛍️ **Product Listings**: Browse popular products and latest arrivals
- 🛒 **Shopping Cart**: Add products to cart with quantity management
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX**: Clean, professional design with smooth animations
- 🔍 **Product Details**: Detailed product pages with full information
- 💾 **Local Storage**: Cart persists across browser sessions

## Tech Stack

- React 18
- React Router DOM
- Vite
- CSS3 (Custom Properties)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Deploy to Netlify

This project is configured for easy deployment to Netlify:

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify**:
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your repository

3. **Build Settings** (automatically configured via `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Deploy**: Netlify will automatically build and deploy your site

The `netlify.toml` file includes:
- Build configuration
- SPA redirects (handles React Router routes)
- Node.js version specification

**Note**: All routes (like `/product/:id` and `/cart`) will work correctly thanks to the redirect configuration that serves `index.html` for all routes.

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── ProductSection.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── ProductDetail.jsx
│   └── Cart.jsx
├── context/         # React Context
│   └── CartContext.jsx
├── data/            # Product data
│   └── products.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Features in Detail

### Product Catalog
- Popular Products section
- Latest Arrivals section
- Horizontal scrolling carousel
- Product cards with images, ratings, prices, and discounts

### Shopping Cart
- Add/remove products
- Update quantities
- Calculate totals
- Persistent storage

### Product Details
- Full product information
- High-quality images
- Ratings and reviews
- Quick add to cart

## Customization

### Adding Products
Edit `src/data/products.js` to add or modify products.

### Styling
Modify CSS variables in `src/index.css` to customize colors and themes.

## License

© 2025 MechHeaven. All rights reserved.

