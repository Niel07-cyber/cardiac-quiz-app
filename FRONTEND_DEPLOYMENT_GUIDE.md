# 🚀 Frontend Deployment Guide - Vercel

## ✅ Backend Status: DEPLOYED! 
**Backend URL:** `https://cardiac-quiz-app.onrender.com` ✅

---

## 🎯 Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account

### Step 2: Import Project
1. Click **"New Project"** or **"Add New..."** → **"Project"**
2. **Import Git Repository:**
   - Find your `cardiac-quiz-app` repository
   - Click **"Import"**

### Step 3: Configure Deployment
1. **Framework Preset:** Vite (should auto-detect)
2. **Root Directory:** `frontend` ⚠️ **IMPORTANT!**
3. **Build Command:** `npm run build` (auto-filled)
4. **Output Directory:** `dist` (auto-filled)
5. **Install Command:** `npm install` (auto-filled)

### Step 4: Environment Variables
**Add this environment variable:**
- **Name:** `VITE_BACKEND_URL`
- **Value:** `https://cardiac-quiz-app.onrender.com`

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Get your frontend URL (like `https://cardiac-quiz-app-frontend.vercel.app`)

---

## 🧪 Test Your Deployed App

After deployment, test these features:
1. **Quiz loads** - Questions appear with videos
2. **Videos play** - Echocardiogram videos display
3. **Answers submit** - Quiz progression works
4. **Results show** - Final score displays

---

## 🔧 Troubleshooting

### If Build Fails:
- Ensure **Root Directory** is set to `frontend`
- Check build logs for missing dependencies
- Verify `package.json` is in `frontend/` folder

### If Backend Connection Fails:
- Verify environment variable `VITE_BACKEND_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is running at `https://cardiac-quiz-app.onrender.com`

### Common Issues:
1. **Wrong Root Directory** - Must be `frontend`, not root
2. **Missing Environment Variable** - Add `VITE_BACKEND_URL`
3. **Build Path Issues** - Vercel should auto-detect Vite settings

---

## ✅ Final Checklist

- [ ] Vercel account created/signed in
- [ ] Repository imported with **Root Directory = `frontend`**
- [ ] Environment variable `VITE_BACKEND_URL` added
- [ ] Frontend deployed successfully
- [ ] Quiz app tested and working
- [ ] Both frontend and backend are live!

---

## 🎉 Success!

After this step, you'll have:
- ✅ **Backend:** `https://cardiac-quiz-app.onrender.com`
- ✅ **Frontend:** `https://your-app.vercel.app`
- ✅ **Full cardiac quiz app deployed and working!**

The frontend will automatically use the production backend URL when deployed to Vercel.
