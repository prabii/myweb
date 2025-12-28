# Ngrok Firebase Setup for Google Auth

## Ngrok URL
- **Ngrok URL**: `https://01ce1a7b1163.ngrok-free.app`
- **Local Forwarding**: `http://localhost:80`

## Step 1: Add Ngrok Domain to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mechheaven-5575c**
3. Click on **Authentication** → **Settings** tab
4. Scroll to **Authorized domains**
5. Click **Add domain**
6. Add: `01ce1a7b1163.ngrok-free.app`
7. Click **Done**

## Step 2: Use Ngrok URL for Local Development

When running locally with ngrok, access your app at:
- **Frontend**: `https://01ce1a7b1163.ngrok-free.app`
- **Backend**: Make sure backend is running on port 80 (or update ngrok forwarding)

## Step 3: Firebase Configuration

The Firebase config in `src/config/firebase.js` will automatically work with ngrok once the domain is authorized in Firebase Console.

## Notes

- Ngrok URL changes each time you restart ngrok (unless you have a paid plan with static domain)
- You'll need to add the new ngrok URL to Firebase each time it changes
- For production, continue using `myweb-seven-chi.vercel.app`
- Local development: Use ngrok URL when testing Google auth locally

## Current Setup

- **Production**: `myweb-seven-chi.vercel.app` (already configured)
- **Local (Ngrok)**: `01ce1a7b1163.ngrok-free.app` (add to Firebase)
- **Localhost**: `localhost` (already configured)

---

**Important**: Only add the ngrok domain to Firebase. Don't change any other Firebase or app configurations.
