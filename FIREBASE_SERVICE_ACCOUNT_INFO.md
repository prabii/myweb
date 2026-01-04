# Firebase Service Account vs Web Config

## What You Have

You have a **Firebase Service Account JSON** file for project `mechheaven-c9097`:
- File: `mechheaven-c9097-firebase-adminsdk-fbsvc-f93f8c772c.json`
- Project ID: `mechheaven-c9097`
- Type: Service Account (for backend/server-side)

## What Your App Currently Uses

Your frontend uses **Firebase Web Config** for project `mechheaven-5575c`:
- Project ID: `mechheaven-5575c`
- Type: Web App Config (for frontend/client-side)
- File: `Frontend/src/config/firebase.js`

---

## Difference Between Service Account and Web Config

### Service Account JSON (`mechheaven-c9097`)
- **Purpose**: Backend/server-side operations
- **Used for**: Admin SDK, server-side Firebase operations
- **NOT used for**: Frontend authentication (Google login)
- **Location**: Usually in backend/server code
- **Security**: Keep secret, never expose to frontend

### Web Config (`mechheaven-5575c`)
- **Purpose**: Frontend/client-side operations
- **Used for**: User authentication (Google login), client SDK
- **Location**: Frontend code (`src/config/firebase.js`)
- **Security**: Safe to expose (public API keys)

---

## Do You Need the Service Account?

### ❌ **NO** - If you only need:
- Google login on frontend
- User authentication
- Client-side Firebase features

**Current setup is correct** - Use `mechheaven-5575c` web config.

### ✅ **YES** - If you need:
- Server-side Firebase Admin operations
- Backend user management
- Server-side database operations
- Cloud Functions

**Then** you would use the service account in your backend.

---

## Current Status

✅ **Your frontend is correctly configured** with:
- Project: `mechheaven-5575c`
- Config: Web App Config
- Purpose: Google authentication

❓ **The service account file** (`mechheaven-c9097`):
- Different project (`mechheaven-c9097` vs `mechheaven-5575c`)
- Not currently used in your app
- Only needed if you want backend Firebase Admin features

---

## Action Required

### For Google Auth (Current Need):

**Use project `mechheaven-5575c`** and add domains:
1. Go to Firebase Console → Select **mechheaven-5575c**
2. Authentication → Settings → Authorized domains
3. Add:
   - `myweb-seven-chi.vercel.app` ✅
   - `075a3695c81a.ngrok-free.app` ✅
   - `localhost` ✅ (usually auto-added)

### If You Want to Use Service Account:

1. **Decide which project to use**:
   - Option A: Keep using `mechheaven-5575c` (current)
   - Option B: Switch to `mechheaven-c9097` (requires updating frontend config)

2. **If switching to `mechheaven-c9097`**:
   - Update `Frontend/src/config/firebase.js` with new project config
   - Get web config from Firebase Console for `mechheaven-c9097`
   - Add domains to `mechheaven-c9097` project

---

## Recommendation

**Keep using `mechheaven-5575c`** (current project) because:
- ✅ Already configured in your app
- ✅ Working for Google authentication
- ✅ Just need to add domains

**Ignore the service account file** unless you need backend Firebase Admin features.

---

## Summary

| File/Config | Project | Purpose | Currently Used? |
|-------------|---------|---------|------------------|
| Web Config | `mechheaven-5575c` | Frontend auth | ✅ Yes |
| Service Account | `mechheaven-c9097` | Backend admin | ❌ No |

**Action**: Add domains to **mechheaven-5575c** project in Firebase Console.
