# HealthEcho Backend Deployment Guide - Render

## 🚀 Quick Start

Your backend is now ready for deployment! Follow these steps to deploy to Render:

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/Sign in with your GitHub account

### Step 2: Deploy Backend to Render

1. **Click "New +" → "Web Service"**

2. **Connect Repository:**
   - Select "Connect a repository"
   - Choose your GitHub repository: `cardiac-quiz-app`
   - Click "Connect"

3. **Configure Service:**
   - **Name:** `cardiac-quiz-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Region:** Choose closest to your users
   - **Branch:** `nextjs`

4. **Build & Deploy Settings:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`

5. **Advanced Settings:**
   - **Auto-Deploy:** Yes (recommended)
   - **Instance Type:** Free tier is fine for testing

6. **Click "Create Web Service"**

### Step 3: Get Your Backend URL

After deployment (takes 2-3 minutes), Render will give you a URL like:
```
https://cardiac-quiz-backend-xxxx.onrender.com
```

**Save this URL! You'll need it for the frontend.**

### Step 4: Test Your Backend

Test your deployed API:
```bash
curl https://your-render-url.onrender.com/
curl https://your-render-url.onrender.com/api/questions
```

You should get JSON responses confirming the API is working.

---

## 🎯 Next Steps

Once your backend is deployed:

1. **Copy the Render URL** (something like `https://cardiac-quiz-backend-xxxx.onrender.com`)

2. **Update Frontend Environment:**
   - Open `frontend/.env.production`
   - Replace `VITE_BACKEND_URL` with your actual Render URL

3. **Deploy Frontend to Vercel:**
   - The frontend folder is ready for Vercel deployment
   - Environment variables are already configured

---

## 🔧 Troubleshooting

### If Build Fails:
- Check the build logs in Render dashboard
- Ensure `requirements.txt` is in the `backend/` folder
- Verify Python version compatibility

### If API Doesn't Respond:
- Check the service logs in Render
- Ensure CORS is enabled (already done in app.py)
- Verify the start command is `gunicorn app:app`

### Common Issues:
1. **Port Issues:** Render automatically assigns port - your Flask app uses `app.run()` which handles this
2. **CORS Errors:** Already handled with `Flask-CORS`
3. **File Paths:** All video files are in `backend/mp4/` folder

---

## 📁 Current Backend Structure
```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── mp4/               # Video files
├── *.pkl              # ML model files
├── *.json             # Data files
└── *.csv              # Dataset files
```

---

## ✅ Deployment Checklist

- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Web service configured with correct settings
- [ ] Backend deployed successfully
- [ ] Backend URL obtained and tested
- [ ] Ready to update frontend environment variables

---

**Your backend is deployment-ready! All files are organized and the Flask app is configured for production with gunicorn.**
