# Backend Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create .env File

Create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb+srv://DB_ECOM:prabhas%40123%24@ecom.cl9lzmi.mongodb.net/mechheaven?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@mechheaven.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
```

**Note:** Password `prabhas@123$` is URL encoded as `prabhas%40123%24` in the connection string (@ = %40, $ = %24)

### 3. Create Uploads Directory

The server will create this automatically, but you can create it manually:

```bash
mkdir uploads
mkdir uploads/image
mkdir uploads/images
```

### 4. Create Default Admin

Run this once to create the default admin account:

```bash
node scripts/createAdmin.js
```

Or use the seed script to create admin + sample data:

```bash
node scripts/seedData.js
```

### 5. Start the Server

```bash
# Development (with nodemon - auto-reload on file changes)
npm run dev

# Or use
npm run server

# Production
npm start
```

**Nodemon Configuration:**
- Automatically restarts server when you change files
- Watches: routes, models, middleware, config folders
- Ignores: node_modules, uploads folders
- Server will run on `http://localhost:5000`

## Admin Dashboard Access

1. Start the backend server
2. Start the frontend (if not already running)
3. Navigate to: `http://localhost:5173/admin`
4. Login with:
   - Email: `admin@mechheaven.com`
   - Password: `admin123`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Sections/Banners
- `GET /api/sections` - Get all sections
- `POST /api/sections` - Create section (admin)
- `PUT /api/sections/:id` - Update section (admin)
- `DELETE /api/sections/:id` - Delete section (admin)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon code
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons/create` - Create coupon (admin)
- `PUT /api/coupons/:id` - Update coupon (admin)
- `DELETE /api/coupons/:id` - Delete coupon (admin)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin

### Upload
- `POST /api/upload/single` - Upload single image (admin)
- `POST /api/upload/multiple` - Upload multiple images (admin)

## Image Upload

Images are stored locally in the `uploads/` folder:
- Single images: `uploads/image/`
- Multiple images: `uploads/images/`

Access uploaded images via: `http://localhost:5000/uploads/image/filename.jpg`

## MongoDB Connection

The MongoDB connection string is already configured:
```
mongodb+srv://DB_ECOM:prabhas@123$@ecom.cl9lzmi.mongodb.net/mechheaven
```

**Credentials:**
- Username: `DB_ECOM`
- Password: `prabhas@123$` (URL encoded automatically in code)

Database name: `mechheaven`

## Troubleshooting

### Port Already in Use
Change the PORT in `.env` file

### MongoDB Connection Failed
- Check your internet connection
- Verify MongoDB connection string
- Ensure MongoDB Atlas allows connections from your IP

### Image Upload Fails
- Ensure `uploads/` directory exists
- Check file permissions
- Verify file size is under 5MB

### Admin Login Fails
- Run `node scripts/createAdmin.js` to create admin
- Check email/password in `.env`
- Verify JWT_SECRET is set
