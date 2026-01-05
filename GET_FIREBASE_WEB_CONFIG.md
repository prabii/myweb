# Get Firebase Web Config for mechheaven-c9097

## ✅ You've Already Done:
- ✅ Added `https://myweb-seven-chi.vercel.app` to Firebase Authorized Domains
- ✅ Service account file is ready in backend

## 🔄 Next Step: Get Web Config

To update the frontend, I need the **Firebase Web Config** from Firebase Console:

### Steps:

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/
   - Select project: **mechheaven-c9097**

2. **Get Web App Config**:
   - Click the gear icon ⚙️ → **Project settings**
   - Scroll down to **Your apps** section
   - If you see a web app (</> icon), click on it
   - If no web app exists:
     - Click **Add app** → Select **Web** (</> icon)
     - Register the app (name: "MechHeaven Frontend")
     - Copy the config

3. **Copy the Config Object**:
   It will look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "mechheaven-c9097.firebaseapp.com",
     projectId: "mechheaven-c9097",
     storageBucket: "mechheaven-c9097.firebasestorage.app",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   }
   ```

4. **Send Me These Values**:
   - `apiKey`
   - `authDomain`
   - `projectId` (should be `mechheaven-c9097`)
   - `storageBucket`
   - `messagingSenderId`
   - `appId`
   - `measurementId`

Once you provide these, I'll update `Frontend/src/config/firebase.js` immediately!

---

## Alternative: Use Environment Variables

If you prefer, you can set these in Vercel environment variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

But I still need the values to update the code! 😊
