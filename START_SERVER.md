# How to Start Backend Server

## Quick Start

```bash
# Navigate to backend folder
cd backend

# Install dependencies (first time only)
npm install

# Start server with nodemon (auto-reload on changes)
npm run dev
```

## Verify Server is Running

After starting, you should see:
```
✅ MongoDB Connected Successfully!
📊 Database: mechheaven
🌐 Host: ecom-shard-00-00.cl9lzmi.mongodb.net
🚀 Server running on port 5000
📡 API URL: http://localhost:5000/api
```

## Test Backend Connection

Open in browser or use curl:
```
http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "MechHeaven API is running",
  "timestamp": "..."
}
```

## Common Issues

### Port 5000 Already in Use
Change port in `.env` file:
```env
PORT=5001
```

### MongoDB Connection Error
See `MONGODB_TROUBLESHOOTING.md` for detailed fixes.

### Admin Login Not Working
1. Make sure backend is running
2. Check browser console for errors
3. Verify API URL in AdminDashboard.jsx matches backend port
4. Test: `http://localhost:5000/api/admin/login` with Postman/curl

## Default Admin Credentials

After running `node scripts/createAdmin.js`:
- Email: `admin@mechheaven.com`
- Password: `admin123`
