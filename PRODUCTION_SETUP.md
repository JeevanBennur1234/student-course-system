# Production Deployment Guide

## Backend Deployment (Render)

### Environment Variables to Set in Render:
```
MONGO_URI=mongodb+srv://bennurjeevan_db_user:GEceam5CCGta11Ji@student-course-system.w2vnnuy.mongodb.net/?appName=student-course-system
JWT_SECRET=162137e3fb6bc35e72dd42115588b3057eae5b6377606f874dd07e827cc005e2
PORT=5001
FRONTEND_URL=https://student-course-system.vercel.app
NODE_ENV=production
```

### Render Settings:
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

## Frontend Deployment (Vercel)

### Environment Variables to Set in Vercel:
```
VITE_API_URL=https://student-course-system.onrender.com
```

### Vercel Settings:
- Root Directory: `frontend`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

## Local Development

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Important Notes:
- Never commit `.env` files
- Update FRONTEND_URL in Render when frontend URL changes
- Update VITE_API_URL in Vercel when backend URL changes
