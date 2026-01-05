# Firebase Admin SDK Setup - mechheaven-c9097

## ✅ Setup Complete

Firebase Admin SDK has been successfully configured for backend server-side operations.

## Files Created/Updated

1. **`backend/config/firebase-admin.js`**
   - Initializes Firebase Admin SDK
   - Reads service account from file or environment variable
   - Automatically loaded when server starts

2. **`backend/config/mechheaven-c9097-firebase-adminsdk-fbsvc-f93f8c772c.json`**
   - Service account credentials for `mechheaven-c9097` project
   - **⚠️ SECURITY**: This file is in `.gitignore` - do NOT commit to Git!

3. **`backend/server.js`**
   - Imports Firebase Admin SDK on startup
   - Ready to use in routes/middleware

4. **`backend/.gitignore`**
   - Added service account JSON files to ignore list

5. **`backend/env.example`**
   - Added Firebase Admin SDK configuration options

## Usage in Backend Routes

You can now use Firebase Admin SDK in your routes:

```javascript
import admin from '../config/firebase-admin.js'

// Example: Verify Firebase ID token
async function verifyToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Example: Get user by UID
async function getUser(uid) {
  try {
    const user = await admin.auth().getUser(uid)
    return user
  } catch (error) {
    throw new Error('User not found')
  }
}
```

## Environment Variables

### For Local Development:
- Service account file is automatically loaded from `config/mechheaven-c9097-firebase-adminsdk-fbsvc-f93f8c772c.json`

### For Production (Render):
Set in Render environment variables:
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"mechheaven-c9097",...}
```

Or set path:
```
FIREBASE_SERVICE_ACCOUNT_PATH=config/mechheaven-c9097-firebase-adminsdk-fbsvc-f93f8c772c.json
```

## Security Notes

- ✅ Service account JSON files are in `.gitignore`
- ✅ Never commit service account credentials to Git
- ✅ Use environment variables in production
- ✅ Service account has admin privileges - keep it secure

## Next Steps

1. **Frontend**: Still needs web config for `mechheaven-c9097` project
2. **Domains**: Add domains to `mechheaven-c9097` Firebase project
3. **Testing**: Test Firebase Admin SDK functions in your routes

---

**Status**: ✅ Backend Firebase Admin SDK ready to use!
