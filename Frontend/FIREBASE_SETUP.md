# Firebase Authentication Setup Guide

## ⚠️ IMPORTANT: Enable Email/Password Authentication

**If you're seeing 400 errors or "auth/operation-not-allowed" errors**, it means Email/Password authentication is **NOT enabled** in your Firebase Console.

### Common Errors:
- `Failed to load resource: the server responded with a status of 400`
- `Firebase: Error (auth/operation-not-allowed)`
- `Email/Password signup is not enabled`

**Solution:** Follow the steps below to enable Email/Password authentication.

### Steps to Enable Email/Password Signup:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `mechheaven-5575c`

2. **Navigate to Authentication**
   - Click on **"Authentication"** in the left sidebar
   - Click on the **"Sign-in method"** tab (or "Providers" tab)

3. **Enable Email/Password**
   - Find **"Email/Password"** in the list of sign-in providers
   - Click on **"Email/Password"**
   - Toggle the **"Enable"** switch to **ON** (it should turn blue/green)
   - **IMPORTANT:** Make sure BOTH options are enabled:
     - ✅ Email/Password (for email/password signup)
     - ✅ Email link (optional, for passwordless)
   - Click **"Save"**

4. **Verify**
   - You should see a **green checkmark** ✅ next to "Email/Password"
   - The status should show **"Enabled"**
   - Refresh your browser/app and try signing up again

### Additional Settings (Optional):

- **Email link (passwordless sign-in)**: You can enable this if you want passwordless authentication
- **Email verification**: Consider enabling email verification for better security

### After Enabling:

Once enabled, users will be able to:
- ✅ Sign up with email and password
- ✅ Login with email and password
- ✅ Use Google login (already working)

### Troubleshooting:

If you still see 400 errors after enabling:

1. **Wait 1-2 minutes** - Firebase changes can take a moment to propagate
2. **Hard refresh your browser** - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. **Clear browser cache** and refresh the page
4. **Double-check Firebase Console** - Make sure Email/Password shows "Enabled" with a green checkmark
5. **Verify Firebase config** - Ensure your `firebaseConfig` matches your project
6. **Check browser console** - Look for any additional error messages
7. **Try in incognito/private mode** - This rules out browser cache issues

### Still Not Working?

If errors persist:
- Make sure you're using the correct Firebase project
- Verify the API key in your config matches the one in Firebase Console
- Check that your Firebase project has billing enabled (if required)
- Try disabling and re-enabling Email/Password authentication

### Firebase Console Direct Link:

[Open Firebase Authentication Settings](https://console.firebase.google.com/project/mechheaven-5575c/authentication/providers)

---

**Note**: Google Sign-In is already working because it's enabled. You just need to enable Email/Password authentication using the steps above.
