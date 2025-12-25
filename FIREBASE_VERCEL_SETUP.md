# Firebase Vercel Domain Authorization Fix

## Problem
You're getting `Firebase: Error (auth/unauthorized-domain)` because your Vercel domain is not authorized in Firebase.

## Solution: Add Vercel Domain to Firebase

### Step 1: Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mechheaven-5575c**

### Step 2: Navigate to Authentication Settings
1. Click on **Authentication** in the left sidebar
2. Click on **Settings** tab (gear icon)
3. Scroll down to **Authorized domains**

### Step 3: Add Your Vercel Domain
1. Click **Add domain** button
2. Add these domains (one at a time):
   - `myweb-seven-chi.vercel.app`
   - `myweb-seven-chi.vercel.app` (if you have a custom domain, add that too)
   - `localhost` (should already be there for local development)

### Step 4: Save Changes
- Click **Done** after adding each domain
- Changes take effect immediately (no need to redeploy)

## Alternative: Use Environment Variables

If you want to use a different Firebase project for production, you can set these environment variables in Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add these variables (if not already set):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

## Quick Fix Checklist

- [ ] Added `myweb-seven-chi.vercel.app` to Firebase Authorized Domains
- [ ] Verified domain is listed in Firebase Console
- [ ] Tested login on Vercel deployment
- [ ] (Optional) Added custom domain if you have one

## Notes

- Firebase allows multiple authorized domains
- Local development (`localhost`) should already be authorized
- Each Vercel deployment gets a unique domain (e.g., `myweb-seven-chi.vercel.app`)
- If you create a new Vercel deployment, you'll need to add the new domain again
