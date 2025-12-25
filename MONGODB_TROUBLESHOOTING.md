# MongoDB Connection Troubleshooting

## Error: "bad auth : Authentication failed"

This error means MongoDB Atlas is rejecting your credentials. Here's how to fix it:

### Step 1: Verify MongoDB Atlas Settings

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Select your cluster**: `ecom` (cl9lzmi)

### Step 2: Check Database User

1. Click **"Database Access"** in the left sidebar
2. Find user: `naceje6549_db_user`
3. Verify the password is: `ik1ishIQwptedpT2`
4. If password is different, either:
   - Update password in MongoDB Atlas to match
   - OR update the connection string in `server.js`

### Step 3: Check Network Access (IMPORTANT!)

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Wait 1-2 minutes for changes to propagate

**This is usually the main issue!** MongoDB Atlas blocks connections by default.

### Step 4: Verify Database Name

1. Go to **"Database"** → **"Browse Collections"**
2. Check if database `mechheaven` exists
3. If not, create it or use an existing database name

### Step 5: Test Connection String

Try this connection string format:

```
mongodb+srv://naceje6549_db_user:ik1ishIQwptedpT2@ecom.cl9lzmi.mongodb.net/mechheaven?retryWrites=true&w=majority
```

### Alternative: Use MongoDB Compass to Test

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Paste connection string
3. Test connection
4. If it works in Compass but not in code, check:
   - Environment variables
   - Code syntax
   - Special characters in password

### Common Issues:

1. **Password has special characters**: Already handled with `encodeURIComponent()`
2. **IP not whitelisted**: Add 0.0.0.0/0 to Network Access
3. **Wrong database name**: Verify in Atlas
4. **User doesn't exist**: Create user in Database Access
5. **User doesn't have permissions**: Ensure user has read/write permissions

### Quick Fix:

If you want to quickly test, try creating a new database user:

1. Go to **Database Access** → **Add New Database User**
2. Username: `admin`
3. Password: `admin123` (or your choice)
4. Database User Privileges: **Atlas admin** or **Read and write to any database**
5. Update connection string in `server.js`:
   ```
   mongodb+srv://admin:admin123@ecom.cl9lzmi.mongodb.net/mechheaven?retryWrites=true&w=majority
   ```

### Still Not Working?

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Verify your MongoDB Atlas account is active
3. Check if you're using the correct cluster
4. Try connecting from MongoDB Compass first
5. Check firewall/antivirus blocking connections
