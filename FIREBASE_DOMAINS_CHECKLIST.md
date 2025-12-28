# Firebase Authorized Domains Checklist

## ⚠️ IMPORTANT: Every Domain Must Be Added

Firebase **requires** every domain to be explicitly added to Authorized Domains. Authentication will **NOT work** on any domain that is not in the list.

---

## Required Domains for Your Project

### ✅ Must Add These Domains:

1. **Production (Vercel)**:
   - Domain: `myweb-seven-chi.vercel.app`
   - Status: ❓ **Check if added**
   - **Action**: Add if not already added

2. **Local Development**:
   - Domain: `localhost`
   - Status: ✅ Usually added by default
   - **Action**: Verify it's there

3. **Ngrok (Current)**:
   - Domain: `075a3695c81a.ngrok-free.app`
   - Status: ❓ **Add this**
   - **Action**: Add to Firebase

---

## How to Add Domains to Firebase

### Step-by-Step:

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/
   - Select project: **mechheaven-5575c**

2. **Navigate to Authentication Settings**:
   - Click **Authentication** in left sidebar
   - Click **Settings** tab (gear icon)
   - Scroll down to **Authorized domains** section

3. **Add Each Domain**:
   - Click **Add domain** button
   - Enter the domain (e.g., `myweb-seven-chi.vercel.app`)
   - Click **Done**
   - Repeat for each domain

4. **Verify All Domains Are Listed**:
   - You should see:
     - `localhost` ✅
     - `myweb-seven-chi.vercel.app` ✅ (if added)
     - `075a3695c81a.ngrok-free.app` ✅ (if added)

---

## Current Status Check

### Test Your Vercel Deployment:

1. Go to: `https://myweb-seven-chi.vercel.app`
2. Try to login with Google
3. **If you see `auth/unauthorized-domain` error**:
   - ❌ Domain is NOT added to Firebase
   - **Fix**: Add `myweb-seven-chi.vercel.app` to Firebase Authorized Domains

4. **If login works**:
   - ✅ Domain is already added
   - No action needed

---

## Quick Fix for Vercel

If your Vercel deployment shows `auth/unauthorized-domain`:

1. **Add to Firebase**:
   - Firebase Console → Authentication → Settings
   - Add domain: `myweb-seven-chi.vercel.app`
   - Click Done

2. **Test Immediately**:
   - Changes take effect instantly (no redeploy needed)
   - Refresh your Vercel site
   - Try Google login again

---

## Domain List Summary

| Domain | Purpose | Required? | Status |
|--------|---------|-----------|--------|
| `localhost` | Local development | ✅ Yes | Usually auto-added |
| `myweb-seven-chi.vercel.app` | Production (Vercel) | ✅ Yes | **Must add manually** |
| `075a3695c81a.ngrok-free.app` | Ngrok testing | ✅ Yes | **Must add manually** |

---

## Notes

- **Each domain must be added separately** - Firebase doesn't auto-detect
- **Changes take effect immediately** - No need to redeploy
- **Ngrok URLs change** - Add new URL each time you restart ngrok
- **Vercel URLs are stable** - Only need to add once

---

## Troubleshooting

### Error: `auth/unauthorized-domain`

**Cause**: Domain not in Firebase Authorized Domains list

**Solution**: 
1. Go to Firebase Console
2. Add the domain to Authorized Domains
3. Refresh your app
4. Try login again

### Login Works on Localhost but Not Vercel

**Cause**: `myweb-seven-chi.vercel.app` not added to Firebase

**Solution**: Add `myweb-seven-chi.vercel.app` to Firebase Authorized Domains

---

**Remember**: Firebase authentication will **NOT work** on any domain that is not explicitly listed in Authorized Domains!
