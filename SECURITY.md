# Security Notes

## Environment Variables

### Backend (.env)
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string (32+ characters)
- `PORT`: Server port (default: 5001)

### Frontend (.env)
- `VITE_API_URL`: Backend API URL (production: https://your-backend.onrender.com)

## Before Deployment

1. **Never commit real credentials to git**
2. **Generate a strong JWT secret**: Use a random 32+ character string
3. **Update MongoDB Atlas IP whitelist** for production
4. **Set proper CORS origins** in production
5. **Use HTTPS** in production

## Production Checklist

- [ ] Strong JWT secret generated
- [ ] Real credentials removed from repository
- [ ] Environment variables configured in deployment platform
- [ ] MongoDB Atlas configured for production
- [ ] Frontend API URLs point to production backend