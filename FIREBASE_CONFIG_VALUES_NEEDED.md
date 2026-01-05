# Firebase Config Values Needed for mechheaven-c9097

## ✅ Current Status

- ✅ Domain `https://myweb-seven-chi.vercel.app` added to Firebase Authorized Domains
- ✅ Backend service account configured
- ✅ Frontend config updated to use `mechheaven-c9097` project
- ⏳ **Need**: Web config values (apiKey, messagingSenderId, appId)

---

## 🔍 How to Get the Values

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select project: **mechheaven-c9097**

### Step 2: Get Web App Config
1. Click **⚙️ Settings** → **Project settings**
2. Scroll down to **Your apps** section
3. **If you see a web app** (</> icon):
   - Click on it
   - You'll see the config object
4. **If NO web app exists**:
   - Click **Add app** → Select **Web** (</> icon)
   - Register app name: "MechHeaven Frontend"
   - Copy the config that appears

### Step 3: Copy These Values

You'll see something like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "mechheaven-c9097.firebaseapp.com",
  projectId: "mechheaven-c9097",
  storageBucket: "mechheaven-c9097.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEFGHIJ"
}
```

### Step 4: Provide These 3 Values

I need these specific values:
1. **`apiKey`** - The long string starting with "AIzaSy..."
2. **`messagingSenderId`** - The number (e.g., "123456789012")
3. **`appId`** - The string like "1:123456789012:web:abcdef..."

---

## 📝 Once You Provide the Values

I'll update `Frontend/src/config/firebase.js` with:
- ✅ `apiKey` → Your actual API key
- ✅ `messagingSenderId` → Your actual sender ID
- ✅ `appId` → Your actual app ID
- ✅ `measurementId` → (Optional, if available)

---

## 🚀 Alternative: Use Vercel Environment Variables

If you prefer to keep values secret, set these in **Vercel** → **Project Settings** → **Environment Variables**:

- `VITE_FIREBASE_API_KEY` = (your apiKey)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` = (your messagingSenderId)
- `VITE_FIREBASE_APP_ID` = (your appId)
- `VITE_FIREBASE_MEASUREMENT_ID` = (your measurementId, optional)

The code will automatically use these if set!

---

**Please provide the 3 values (apiKey, messagingSenderId, appId) and I'll update the config file immediately!** 🎯
