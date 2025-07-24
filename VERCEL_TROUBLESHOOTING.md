# 🚨 Vercel Deployment Troubleshooting Guide

## Current Issues Identified:

### ❌ **Issue 1: Doctor vs AI Image Not Showing**
**Problem:** Image `/doctor-vs-ai.jpg` not displaying on Vercel  
**Status:** ✅ Fixed - Image was moved to `frontend/public/doctor-vs-ai.jpg`

### ❌ **Issue 2: Quiz Page Not Loading**
**Problem:** `/quiz` route shows blank or error  
**Possible Causes:**
1. Environment variable `VITE_BACKEND_URL` not set in Vercel
2. Backend API not responding
3. Build errors

---

## 🔍 **Debugging Steps**

### Step 1: Check Environment Variables
Visit: `https://cardiac-quiz-app-frontend.vercel.app/env-check`

**Expected Result:**
```
Mode: production
Backend URL: https://cardiac-quiz-app.onrender.com
```

**If Backend URL shows "NOT SET":**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_BACKEND_URL` = `https://cardiac-quiz-app.onrender.com`
3. Redeploy the project

### Step 2: Check Backend API
Test backend directly:
```bash
curl https://cardiac-quiz-app.onrender.com/
curl https://cardiac-quiz-app.onrender.com/api/questions
```

**Expected Results:**
- First command: JSON with status "running"
- Second command: Array of quiz questions

### Step 3: Check Browser Console
1. Go to `https://cardiac-quiz-app-frontend.vercel.app/quiz`
2. Open Browser Developer Tools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests

---

## 🛠️ **Fix Environment Variables in Vercel**

### Method 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click on your `cardiac-quiz-app-frontend` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://cardiac-quiz-app.onrender.com`
   - **Environments:** Check "Production", "Preview", "Development"
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** on the latest deployment

### Method 2: Vercel CLI (if you have it)
```bash
vercel env add VITE_BACKEND_URL production
# Enter: https://cardiac-quiz-app.onrender.com
vercel --prod
```

---

## 🔧 **Common Solutions**

### Solution 1: Force Redeploy
After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click the **three dots** (⋯) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Solution 2: Clear Vercel Cache
```bash
# If you have Vercel CLI installed
vercel --prod --force
```

### Solution 3: Check Image Paths
Ensure all images use absolute paths from public folder:
- ✅ Correct: `src="/doctor-vs-ai.jpg"`
- ❌ Wrong: `src="./assets/doctor-vs-ai.jpg"`

---

## 📋 **Verification Checklist**

After applying fixes, verify:

- [ ] **Environment Check:** Visit `/env-check` - Backend URL should show Render URL
- [ ] **Home Page:** Visit `/` - Doctor vs AI image should display
- [ ] **Quiz Page:** Visit `/quiz` - Should show "Start the test" button
- [ ] **API Connection:** Start quiz - Should load questions from backend
- [ ] **Browser Console:** No JavaScript errors
- [ ] **Network Tab:** All API calls return 200 status

---

## 🎯 **Expected Behavior**

### Home Page (`/`)
- ✅ Doctor vs AI image visible
- ✅ "Start Quiz" button works
- ✅ Navigation to quiz page works

### Quiz Page (`/quiz`)
- ✅ "Start the test" button visible
- ✅ Clicking starts quiz and loads questions
- ✅ Videos play correctly
- ✅ Answer submission works
- ✅ AI predictions work

### Environment Check (`/env-check`)
- ✅ Shows `Mode: production`
- ✅ Shows `Backend URL: https://cardiac-quiz-app.onrender.com`

---

## 🚀 **Quick Fix Commands**

If you need to redeploy quickly:

```bash
# Force rebuild and redeploy
git commit --allow-empty -m "Force redeploy"
git push origin nextjs
```

Then Vercel will auto-deploy the changes.

---

**Most likely issue:** Environment variable `VITE_BACKEND_URL` not set in Vercel dashboard. Check `/env-check` page first!
