# Admin Dashboard Guide

## 🎯 Complete Backend & Admin Dashboard Setup

### What's Included:

1. ✅ **Backend API** (Express.js + MongoDB)
2. ✅ **Admin Dashboard** (React Frontend)
3. ✅ **Image Upload System** (Local Storage)
4. ✅ **Product Management** (CRUD Operations)
5. ✅ **Section/Banner Management** (Dynamic Content)
6. ✅ **Coupon/Discount System** (Full Implementation)

---

## 🚀 Quick Setup

### Backend Setup:

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from SETUP_INSTRUCTIONS.md)
# MongoDB connection is already configured:
# mongodb+srv://naceje6549_db_user:ik1ishIQwptedpT2@ecom.cl9lzmi.mongodb.net/mechheaven

# 4. Create default admin
node scripts/createAdmin.js

# 5. Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Frontend Setup:

The admin dashboard is already integrated! Just:

```bash
# From root directory
npm run dev
```

Then navigate to: `http://localhost:5173/admin`

---

## 🔐 Admin Login

**Default Credentials:**
- Email: `admin@mechheaven.com`
- Password: `admin123`

**To change:** Edit `.env` file in backend folder and run `node scripts/createAdmin.js` again.

---

## 📦 Features

### 1. Products Management
- ✅ Add/Edit/Delete products
- ✅ Upload product images
- ✅ Set prices, discounts, categories
- ✅ Manage stock and featured status
- ✅ All fields are dynamic

### 2. Sections/Banners Management
- ✅ Create dynamic banners
- ✅ Upload section images
- ✅ Set titles, descriptions, links
- ✅ Control positioning and visibility
- ✅ Multiple section types (banner, hero, category, promotion)

### 3. Coupons/Discounts
- ✅ Create percentage or fixed discounts
- ✅ Set minimum purchase requirements
- ✅ Set usage limits
- ✅ Set validity dates
- ✅ Track usage count
- ✅ Validate and apply coupons

### 4. Image Upload
- ✅ Single image upload
- ✅ Multiple image upload
- ✅ Image preview
- ✅ URL or file upload
- ✅ Images stored locally in `backend/uploads/`

---

## 🎨 Admin Dashboard Tabs

### Products Tab
- View all products
- Add new products with image upload
- Edit existing products
- Delete products
- Filter by category

### Sections Tab
- Manage homepage banners
- Create hero sections
- Upload section images
- Set links and button text
- Control display order

### Coupons Tab
- Create discount coupons
- Set discount types (percentage/fixed)
- Configure validity periods
- Track usage statistics
- Enable/disable coupons

---

## 🔌 API Integration

The frontend can now connect to the backend API. Update your frontend code to fetch from:

```javascript
const API_URL = 'http://localhost:5000/api'

// Example: Fetch products
fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data.data))
```

---

## 📁 File Structure

```
backend/
├── models/          # MongoDB models (Product, Section, Coupon, Admin)
├── routes/          # API routes
├── middleware/      # Auth & upload middleware
├── uploads/         # Uploaded images (created automatically)
├── scripts/         # Utility scripts
├── server.js        # Main server file
└── package.json     # Backend dependencies

src/pages/
└── AdminDashboard.jsx  # Admin dashboard component
```

---

## 🎫 Coupon Usage Example

### Validate Coupon:
```javascript
POST /api/coupons/validate
Body: { code: "SAVE20", totalAmount: 5000 }
```

### Apply Coupon:
```javascript
POST /api/coupons/apply
Body: { code: "SAVE20", totalAmount: 5000 }
Response: { discount: 1000, finalAmount: 4000 }
```

---

## 🖼️ Image Upload

Images are uploaded to `backend/uploads/` and accessible via:
- `http://localhost:5000/uploads/image/filename.jpg`
- `http://localhost:5000/uploads/images/filename.jpg`

---

## 🔒 Security

- JWT-based authentication for admin routes
- Password hashing with bcrypt
- Role-based access control (admin, super-admin)
- File upload validation (images only, 5MB limit)

---

## 📝 Notes

1. **MongoDB Connection**: Already configured with your credentials
2. **Image Storage**: Currently local storage. Can be upgraded to Cloudinary later
3. **CORS**: Configured for `http://localhost:5173` (update in `.env` if needed)
4. **Admin Token**: Stored in localStorage as `adminToken`

---

## 🐛 Troubleshooting

### Backend won't start:
- Check if port 5000 is available
- Verify MongoDB connection string
- Ensure all dependencies are installed

### Can't login to admin:
- Run `node scripts/createAdmin.js`
- Check `.env` file exists
- Verify email/password match

### Images not uploading:
- Check `uploads/` folder exists
- Verify file size < 5MB
- Check file type is image (jpg, png, gif, webp)

### API calls failing:
- Ensure backend is running on port 5000
- Check CORS settings in `server.js`
- Verify admin token in localStorage

---

## 🎉 You're All Set!

Your complete admin dashboard is ready with:
- ✅ Dynamic product management
- ✅ Dynamic section/banner management  
- ✅ Full coupon/discount system
- ✅ Image upload functionality
- ✅ MongoDB database integration
- ✅ Secure admin authentication

Access the dashboard at: `http://localhost:5173/admin`
