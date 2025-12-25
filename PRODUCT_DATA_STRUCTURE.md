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
- **Example**: `["https://example.com/img1.jpg", "https://example.com/img2.jpg"]`
- **Description**: Additional product images (gallery)

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

## Complete Product Example

```json
{
  "name": "Smart Robot Vacuum Cleaner",
  "brand": "TechHome",
  "description": "Advanced robot vacuum with AI navigation, perfect for hardwood floors and carpets. Features auto-charging and app control.",
  "price": 2999.00,
  "originalPrice": 3999.00,
  "discount": 25,
  "category": "smart-home",
  "image": "https://example.com/vacuum.jpg",
  "images": [
    "https://example.com/vacuum-1.jpg",
    "https://example.com/vacuum-2.jpg",
    "https://example.com/vacuum-3.jpg"
  ],
  "rating": 4.5,
  "reviews": 125,
  "stock": 50,
  "delivery": "Free delivery",
  "amazonUrl": "https://amazon.in/dp/B08XYZ123",
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
   - Upload a file (will be stored on server)
   - Enter an image URL (external link)

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

**Last Updated**: Based on current Admin Dashboard implementation
