# Product Data Structure for Admin Dashboard

## Complete Product Fields Reference

This document lists all product fields available in the admin dashboard and their data types.

---

## Required Fields (*)

### 1. **Product Name** (`name`)
- **Type**: String (Text)
- **Required**: Yes
- **Example**: `"Smart Robot Vacuum Cleaner"`
- **Description**: The display name of the product

### 2. **Brand** (`brand`)
- **Type**: String (Text)
- **Required**: Yes
- **Example**: `"TechHome"`, `"DIY Master"`, `"SmartLife"`
- **Description**: Manufacturer or brand name

### 3. **Description** (`description`)
- **Type**: String (Text/Textarea)
- **Required**: Yes
- **Example**: `"Advanced robot vacuum with AI navigation, perfect for hardwood floors and carpets. Features auto-charging and app control."`
- **Description**: Detailed product description

### 4. **Price** (`price`)
- **Type**: Number (Decimal)
- **Required**: Yes
- **Format**: Indian Rupees (₹)
- **Example**: `2999.00`, `1599.50`
- **Description**: Current selling price

### 5. **Category** (`category`)
- **Type**: String (Dropdown)
- **Required**: Yes
- **Options**: Select from existing categories (e.g., `smart-home`, `diy-kits`, `electronics`)
- **Description**: Product category slug (must match a category in the system)

### 6. **Product Image** (`image`)
- **Type**: String (URL) or File Upload
- **Required**: Yes
- **Example**: 
  - URL: `"https://example.com/image.jpg"`
  - Upload: Select file from computer
- **Description**: Main product image URL or uploaded file

---

## Optional Fields

### 7. **Original Price** (`originalPrice`)
- **Type**: Number (Decimal)
- **Required**: No
- **Format**: Indian Rupees (₹)
- **Example**: `3999.00`
- **Description**: Original price before discount (for showing "was ₹3999, now ₹2999")

### 8. **Discount** (`discount`)
- **Type**: Number (Percentage)
- **Required**: No
- **Range**: 0-100
- **Example**: `25` (means 25% off)
- **Description**: Discount percentage

### 9. **Stock** (`stock`)
- **Type**: Number (Integer)
- **Required**: No
- **Default**: `0`
- **Example**: `50`, `100`, `0` (out of stock)
- **Description**: Available quantity in stock

### 10. **Rating** (`rating`)
- **Type**: Number (Decimal)
- **Required**: No
- **Range**: 0-5
- **Default**: `0`
- **Example**: `4.5`, `4.8`
- **Description**: Average customer rating

### 11. **Reviews** (`reviews`)
- **Type**: Number (Integer)
- **Required**: No
- **Default**: `0`
- **Example**: `125`, `342`
- **Description**: Total number of customer reviews

### 12. **Delivery** (`delivery`)
- **Type**: String (Text)
- **Required**: No
- **Default**: `"Free delivery"`
- **Example**: `"Free delivery"`, `"Express delivery"`, `"Standard shipping"`
- **Description**: Delivery information

### 13. **Additional Images** (`images`)
- **Type**: Array of Strings (URLs)
- **Required**: No
- **Example URLs**: 
  ```json
  [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    "https://m.media-amazon.com/images/I/71abc123xyz._AC_SL1500_.jpg",
    "https://myweb-hyh3.onrender.com/api/uploads/products/vacuum-side.jpg",
    "https://myweb-hyh3.onrender.com/api/uploads/products/vacuum-back.jpg"
  ]
  ```
- **Description**: Additional product images (gallery) - multiple views of the product

### 14. **Amazon URL** (`amazonUrl`)
- **Type**: String (URL)
- **Required**: No
- **Example**: `"https://amazon.in/dp/B08XYZ123"`
- **Description**: Link to product on Amazon (if applicable)

### 15. **Tags** (`tags`)
- **Type**: Array of Strings
- **Required**: No
- **Example**: `["smart", "automated", "wi-fi", "app-control"]`
- **Description**: Product tags for search and filtering

### 16. **Specifications** (`specifications`)
- **Type**: Object/Map (Key-Value pairs)
- **Required**: No
- **Example**: 
  ```json
  {
    "Power": "1200W",
    "Battery": "3000mAh",
    "Weight": "3.5kg",
    "Dimensions": "30x30x10cm"
  }
  ```
- **Description**: Technical specifications (key-value pairs)

### 17. **Featured** (`featured`)
- **Type**: Boolean (Checkbox)
- **Required**: No
- **Default**: `false`
- **Options**: Checked/Unchecked
- **Description**: Mark product as featured (shown on homepage)

### 18. **Active** (`active`)
- **Type**: Boolean (Checkbox)
- **Required**: No
- **Default**: `true`
- **Options**: Checked/Unchecked
- **Description**: Show/hide product on website

---

## Complete Product Example with URLs

```json
{
  "name": "Smart Robot Vacuum Cleaner",
  "brand": "TechHome",
  "description": "Advanced robot vacuum with AI navigation, perfect for hardwood floors and carpets. Features auto-charging and app control.",
  "price": 2999.00,
  "originalPrice": 3999.00,
  "discount": 25,
  "category": "smart-home",
  "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
  "images": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    "https://m.media-amazon.com/images/I/71abc123xyz._AC_SL1500_.jpg",
    "https://myweb-hyh3.onrender.com/api/uploads/products/vacuum-side.jpg"
  ],
  "rating": 4.5,
  "reviews": 125,
  "stock": 50,
  "delivery": "Free delivery",
  "amazonUrl": "https://www.amazon.in/dp/B08XYZ123",
  "tags": ["smart", "automated", "wi-fi", "app-control", "robot"],
  "specifications": {
    "Power": "1200W",
    "Battery": "3000mAh",
    "Weight": "3.5kg",
    "Dimensions": "30x30x10cm",
    "Runtime": "90 minutes",
    "Noise Level": "55dB"
  },
  "featured": true,
  "active": true
}
```

---

## Admin Dashboard Form Fields

### Fields Available in the Form:

1. ✅ **Product Name** - Text input (Required)
2. ✅ **Brand** - Text input (Required)
3. ✅ **Description** - Textarea (Required)
4. ✅ **Price** - Number input (Required)
5. ✅ **Original Price** - Number input (Optional)
6. ✅ **Discount** - Number input (Optional)
7. ✅ **Category** - Dropdown selector (Required)
8. ✅ **Stock** - Number input (Optional)
9. ✅ **Product Image** - File upload OR URL input (Required)
10. ✅ **Featured Product** - Checkbox (Optional)
11. ✅ **Active** - Checkbox (Optional)

### Fields NOT in Form (Can be added via API or database):

- ❌ **Rating** - Can be updated via API
- ❌ **Reviews** - Can be updated via API
- ❌ **Additional Images** (`images` array) - Can be added via API
- ❌ **Amazon URL** - Can be added via API
- ❌ **Tags** - Can be added via API
- ❌ **Specifications** - Can be added via API
- ❌ **Delivery** - Has default value

---

## Category Reference

Categories must match existing category slugs. Common categories:

- `smart-home` - Smart Home Solutions
- `diy-kits` - DIY Miniature Kits
- `electronics` - Electronics
- `home-kitchen` - Home & Kitchen
- `hobbies` - Hobbies

**Note**: Categories are managed separately in the Admin Dashboard under "Categories" tab.

---

## Tips for Admin

1. **Image Upload**: You can either:
   - **Upload a file**: Will be stored at `https://myweb-hyh3.onrender.com/api/uploads/products/filename.jpg`
   - **Enter an image URL**: Use external URLs like:
     - Unsplash: `https://images.unsplash.com/photo-...`
     - Amazon: `https://m.media-amazon.com/images/I/...`
     - Any public image URL
   - **Image Requirements**: 
     - Formats: JPG, PNG, WebP
     - Recommended size: 800x800px or larger
     - Max file size: 5MB

2. **Price Calculation**: 
   - If you set `originalPrice` and `price`, discount will be calculated automatically
   - Or set `discount` percentage directly

3. **Stock Management**:
   - Set `stock: 0` to mark as out of stock
   - Update stock regularly after orders

4. **Featured Products**:
   - Only featured products appear on homepage
   - Limit to 6-12 featured products for best UX

5. **Active Status**:
   - Uncheck "Active" to hide product without deleting
   - Useful for seasonal products or temporary unavailability

---

## API Endpoints

- **GET** `/api/products` - Get all products
- **GET** `/api/products/:id` - Get single product
- **POST** `/api/products` - Create product (Admin only)
- **PUT** `/api/products/:id` - Update product (Admin only)
- **DELETE** `/api/products/:id` - Delete product (Admin only)

---

## Data Validation Rules

- `name`: Min 3 characters, Max 200 characters
- `brand`: Min 2 characters, Max 50 characters
- `description`: Min 10 characters, Max 2000 characters
- `price`: Must be > 0
- `originalPrice`: Must be >= `price` (if provided)
- `discount`: Must be between 0-100
- `stock`: Must be >= 0
- `rating`: Must be between 0-5
- `category`: Must match existing category slug

---

## Quick Reference Card

| Field | Type | Required | Default | Admin Form |
|-------|------|----------|---------|------------|
| name | String | ✅ Yes | - | ✅ Yes |
| brand | String | ✅ Yes | - | ✅ Yes |
| description | String | ✅ Yes | - | ✅ Yes |
| price | Number | ✅ Yes | - | ✅ Yes |
| originalPrice | Number | ❌ No | - | ✅ Yes |
| discount | Number | ❌ No | 0 | ✅ Yes |
| category | String | ✅ Yes | - | ✅ Yes |
| image | String | ✅ Yes | - | ✅ Yes |
| images | Array | ❌ No | [] | ❌ No |
| rating | Number | ❌ No | 0 | ❌ No |
| reviews | Number | ❌ No | 0 | ❌ No |
| stock | Number | ❌ No | 0 | ✅ Yes |
| delivery | String | ❌ No | "Free delivery" | ❌ No |
| amazonUrl | String | ❌ No | - | ❌ No |
| tags | Array | ❌ No | [] | ❌ No |
| specifications | Object | ❌ No | {} | ❌ No |
| featured | Boolean | ❌ No | false | ✅ Yes |
| active | Boolean | ❌ No | true | ✅ Yes |

---

## URL Examples Reference

### Image URL Sources:

1. **Unsplash** (Free stock photos):
   ```
   https://images.unsplash.com/photo-1558618666-fcd25c85cd64
   https://images.unsplash.com/photo-1581091226825-a6a2a5aee158
   ```

2. **Amazon Product Images**:
   ```
   https://m.media-amazon.com/images/I/71abc123xyz._AC_SL1500_.jpg
   https://m.media-amazon.com/images/I/81def456uvw._AC_SX679_.jpg
   ```

3. **Server Uploaded Images**:
   ```
   https://myweb-hyh3.onrender.com/api/uploads/products/vacuum-cleaner.jpg
   https://myweb-hyh3.onrender.com/api/uploads/products/diy-kit-1.jpg
   ```

4. **CDN URLs** (Cloudinary, Imgur, etc.):
   ```
   https://res.cloudinary.com/your-cloud/image/upload/v123/product.jpg
   https://i.imgur.com/abc123.jpg
   ```

### Amazon Product URLs:

1. **Standard Product Page**:
   ```
   https://www.amazon.in/dp/B08XYZ123
   ```

2. **Full Product URL**:
   ```
   https://www.amazon.in/Smart-Robot-Vacuum-Cleaner/dp/B08XYZ123/ref=sr_1_1
   ```

3. **Amazon Short Link**:
   ```
   https://amzn.to/3abc123
   ```

### API Request Examples:

**Get All Products**:
```bash
curl https://myweb-hyh3.onrender.com/api/products
```

**Get Products by Category**:
```bash
curl https://myweb-hyh3.onrender.com/api/products?category=smart-home
```

**Create Product** (with auth token):
```bash
curl -X POST https://myweb-hyh3.onrender.com/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smart Robot Vacuum",
    "brand": "TechHome",
    "description": "Advanced robot vacuum...",
    "price": 2999,
    "category": "smart-home",
    "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
  }'
```

**Upload Image**:
```bash
curl -X POST https://myweb-hyh3.onrender.com/api/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

---

**Last Updated**: Based on current Admin Dashboard implementation  
**Backend URL**: `https://myweb-hyh3.onrender.com/api`  
**Frontend URL**: `https://myweb-seven-chi.vercel.app`
