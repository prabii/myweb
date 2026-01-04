# Switching to Firebase Project: mechheaven-c9097

## ✅ Completed Steps

1. ✅ Service account file saved to `backend/config/`
2. ✅ Firebase Admin SDK installed in backend
3. ✅ Backend Firebase Admin config created

## 🔄 Next Steps Required

### Step 1: Get Firebase Web Config for mechheaven-c9097

You need to get the **Web App Config** (not service account) from Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **mechheaven-c9097**
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **Your apps** section
5. If no web app exists, click **Add app** → **Web** (</> icon)
6. Register the app (name it "MechHeaven Frontend")
7. Copy the **Firebase configuration object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mechheaven-c9097.firebaseapp.com",
  projectId: "mechheaven-c9097",
  storageBucket: "mechheaven-c9097.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
}
```

### Step 2: Update Frontend Firebase Config

Once you have the web config, I'll update:
- `Frontend/src/config/firebase.js` with the new config
- Environment variables (if needed)

### Step 3: Add Domains to Firebase

Add these domains to **mechheaven-c9097** project:

1. Firebase Console → **mechheaven-c9097** → Authentication → Settings
2. Scroll to **Authorized domains**
3. Add:
   - `localhost` (if not already there)
   - `myweb-seven-chi.vercel.app`
   - `075a3695c81a.ngrok-free.app` (or your current ngrok URL)

---

## Current Status

| Component | Project | Status |
|-----------|---------|--------|
| Backend Admin SDK | `mechheaven-c9097` | ✅ Ready |
| Frontend Web Config | `mechheaven-5575c` | ⏳ Waiting for web config |
| Service Account | `mechheaven-c9097` | ✅ Saved |

---

## What's Done

- ✅ Backend can now use Firebase Admin SDK with `mechheaven-c9097`
- ✅ Service account file is in `backend/config/`
- ✅ Backend Firebase Admin initialized

## What's Needed

- ⏳ Web config for `mechheaven-c9097` from Firebase Console
- ⏳ Update frontend Firebase config
- ⏳ Add domains to `mechheaven-c9097` project

---

**Please provide the Firebase web config for `mechheaven-c9097` so I can update the frontend!**
