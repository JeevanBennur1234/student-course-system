# Deployment Guide

## Deploy to Render

### Backend Deployment

1. Go to https://render.com and sign in with GitHub
2. Click "New +" → "Web Service"
3. Select your `student-course-system` repository
4. Configure:
   - **Name**: `student-course-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables (in Render dashboard):
   ```
   MONGO_URI = your_mongodb_atlas_connection_string
   JWT_SECRET = your_secure_jwt_secret_32_chars_minimum
   PORT = 5001
   ```
   
   **Important**: Use your actual MongoDB Atlas connection string and generate a secure JWT secret.

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://student-course-backend.onrender.com`)

### Frontend Deployment

#### Option 1: Vercel (Recommended)
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Import your `student-course-system` repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
5. Add Environment Variable:
   ```
   VITE_API_URL = https://your-backend-url.onrender.com
   ```
6. Click "Deploy"

#### Option 2: Render Static Site
1. Click "New +" → "Static Site"
2. Select your repository
3. Configure:
   - **Name**: `student-course-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### After Deployment

Update frontend API URLs with your deployed backend URL in:
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/RegisterPage.jsx`
- `frontend/src/pages/CoursesPage.jsx`
- `frontend/src/pages/MyCoursesPage.jsx`

Replace `http://localhost:5001` with `https://your-backend-url.onrender.com`
