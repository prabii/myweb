# Firebase Domain Troubleshooting - auth/unauthorized-domain

## ⚠️ Important: Vercel Uses Multiple Domains

Vercel creates **multiple domains** for your project, and **ALL of them** must be added to Firebase Authorized Domains!

---

## 🔍 Step 1: Find ALL Your Vercel Domains

### Check Your Vercel Dashboard:

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project (`myweb`)
3. Go to **Settings** → **Domains**
4. You'll see ALL domains listed:
   - Production domain (e.g., `myweb-seven-chi.vercel.app`)
   - Preview domains (e.g., `myweb-git-main-navyas-projects-ef4aba07.vercel.app`)
   - Custom domains (if any)

### Or Check Your Browser:

When you visit your site, check the **exact URL** in the browser address bar. That's the domain you need to add!

---

## ✅ Step 2: Add ALL Domains to Firebase

### For Project: `mechheaven-c9097`

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: **mechheaven-c9097**
3. Click **Authentication** → **Settings** tab
4. Scroll to **Authorized domains**
5. Add **EACH** domain separately:

**Add these domains (one at a time):**
- `localhost` (if not already there)
- `myweb-seven-chi.vercel.app` ✅ (you mentioned you added this)
- `myweb-git-main-navyas-projects-ef4aba07.vercel.app` ⚠️ **ADD THIS**
- `myweb-j829ufjbv-navyas-projects-ef4aba07.vercel.app` ⚠️ **ADD THIS**
- Any other Vercel domains you see in your dashboard

**Important**: Add the **exact domain** shown in your browser when accessing the site!

---

## 🔍 Step 3: Verify the Domain You're Using

### Check the Exact Domain:

1. Open your Vercel site in a browser
2. Look at the address bar - what's the **exact domain**?
3. Copy that exact domain
4. Add it to Firebase Authorized Domains

### Common Vercel Domain Patterns:

- `[project-name]-[hash].vercel.app` (production)
- `[project-name]-git-[branch]-[username]-projects-[hash].vercel.app` (preview)
- `[project-name]-[deployment-hash]-[username]-projects-[hash].vercel.app` (preview)

---

## 🚨 Common Issues

### Issue 1: Wrong Domain Added
- **Problem**: You added `myweb-seven-chi.vercel.app` but Vercel is using a different domain
- **Solution**: Check what domain is actually shown in your browser and add that exact one

### Issue 2: Preview Domain Not Added
- **Problem**: Vercel preview deployments use different domains
- **Solution**: Add ALL domains from Vercel Settings → Domains

### Issue 3: Domain Typo
- **Problem**: Small typo in domain name
- **Solution**: Double-check spelling, no `www`, no trailing slash

### Issue 4: Wrong Firebase Project
- **Problem**: Added domain to wrong Firebase project
- **Solution**: Make sure you're adding to **mechheaven-c9097** (not mechheaven-5575c)

---

## ✅ Quick Checklist

- [ ] Checked Vercel Dashboard → Settings → Domains for ALL domains
- [ ] Added `localhost` to Firebase (if testing locally)
- [ ] Added production domain: `myweb-seven-chi.vercel.app`
- [ ] Added preview domain: `myweb-git-main-navyas-projects-ef4aba07.vercel.app`
- [ ] Added deployment domain: `myweb-j829ufjbv-navyas-projects-ef4aba07.vercel.app`
- [ ] Verified domain spelling (no typos)
- [ ] Verified correct Firebase project: **mechheaven-c9097**
- [ ] Refreshed browser after adding domains
- [ ] Cleared browser cache if still not working

---

## 🔧 Quick Fix Steps

1. **Open your Vercel site** → Check the exact URL in address bar
2. **Copy that exact domain** (e.g., `myweb-git-main-navyas-projects-ef4aba07.vercel.app`)
3. **Go to Firebase Console** → `mechheaven-c9097` → Authentication → Settings
4. **Add domain** → Paste the exact domain → Click Done
5. **Refresh your site** → Try Google login again

**Changes take effect immediately** - no redeploy needed!

---

## 📝 Example: What to Add

Based on your build logs, add these domains:

```
localhost
myweb-seven-chi.vercel.app
myweb-git-main-navyas-projects-ef4aba07.vercel.app
myweb-j829ufjbv-navyas-projects-ef4aba07.vercel.app
```

**Note**: Replace with your actual domains from Vercel dashboard!

---

## 🎯 Still Not Working?

1. **Double-check the exact domain** in your browser address bar
2. **Verify Firebase project** is `mechheaven-c9097` (not `mechheaven-5575c`)
3. **Clear browser cache** and try again
4. **Check browser console** for the exact error message
5. **Wait 1-2 minutes** after adding domain (sometimes takes a moment)

---

**Remember**: Firebase authentication will **NOT work** on any domain that is not explicitly listed in Authorized Domains!
