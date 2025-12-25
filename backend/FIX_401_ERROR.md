# Fix 401 Unauthorized Error

## Status: 401 Unauthorized

This means:
- ✅ Backend server IS running
- ✅ Request is reaching the server
- ❌ Authentication is failing

## Quick Fix Steps:

### Step 1: Check if Admin Exists

```bash
cd backend
node scripts/checkAdmin.js
```

This will show:
- All admin users in database
- Their emails and status
- Whether default admin exists

### Step 2: Create Admin (if doesn't exist)

```bash
cd backend
node scripts/createAdmin.js
```

This creates:
- Email: `admin@mechheaven.com`
- Password: `admin123`
- Role: `super-admin`

### Step 3: Verify Login Credentials

**Default Credentials:**
- Email: `admin@mechheaven.com`
- Password: `admin123`

**Try logging in with these exact credentials.**

### Step 4: Check Backend Console

When you try to login, check backend console for:
- `🔐 Admin login attempt: { email: '...' }`
- `❌ Admin not found` OR `❌ Password mismatch`
- `✅ Admin login successful`

## Common Issues:

### 1. Admin Doesn't Exist
**Solution:** Run `node scripts/createAdmin.js`

### 2. Wrong Email/Password
**Solution:** 
- Use exact: `admin@mechheaven.com` / `admin123`
- Check backend console for which one is wrong

### 3. Password Field Not Selected
**Solution:** Already fixed - password field now uses `select: false` and `select('+password')`

### 4. Admin Account Inactive
**Solution:** Check MongoDB - admin.active should be `true`

## Test Login Manually:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@mechheaven.com\",\"password\":\"admin123\"}"
```

**Expected Success Response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "data": {
    "id": "...",
    "email": "admin@mechheaven.com",
    "name": "Super Admin",
    "role": "super-admin"
  }
}
```

## Still Getting 401?

1. **Check backend console** - it will show exactly what's wrong
2. **Run checkAdmin script** - see if admin exists
3. **Create admin again** - might have been created incorrectly
4. **Check MongoDB directly** - verify admin document exists
