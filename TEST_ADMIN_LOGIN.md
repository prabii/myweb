# Test Admin Login

## Quick Test

### 1. Start Backend Server
```bash
cd backend
npm run dev
```

### 2. Test Login Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@mechheaven.com\",\"password\":\"admin123\"}"
```

**Using Postman:**
- Method: POST
- URL: `http://localhost:5000/api/admin/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "admin@mechheaven.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "email": "admin@mechheaven.com",
    "name": "Super Admin",
    "role": "super-admin"
  }
}
```

### 3. Create Admin if Not Exists

If login fails with "Invalid credentials", create admin:

```bash
cd backend
node scripts/createAdmin.js
```

This creates:
- Email: `admin@mechheaven.com`
- Password: `admin123`
- Role: `super-admin`

### 4. Check Backend Logs

When you try to login, check backend console for:
- `🔐 Admin login attempt: { email: '...' }`
- `✅ Admin login successful` or error messages

## Troubleshooting

### ERR_FAILED Error
- **Backend not running**: Start with `npm run dev` in backend folder
- **Wrong port**: Check if backend is on port 5000
- **CORS issue**: Backend CORS is configured to allow localhost:5173

### Invalid Credentials
- Run `node scripts/createAdmin.js` to create admin
- Check MongoDB connection is working
- Verify admin was created in database

### Network Error
- Check backend server is running
- Verify `http://localhost:5000/api/health` works
- Check browser console for CORS errors
