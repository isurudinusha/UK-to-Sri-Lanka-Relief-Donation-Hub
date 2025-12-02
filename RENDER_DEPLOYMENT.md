# Deploying to Render

This guide will walk you through deploying the UK to Sri Lanka Relief Donation Hub to Render.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- Your MongoDB Atlas connection string
- This repository pushed to GitHub

## Deployment Steps

### 1. Push to GitHub

Ensure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository
4. Select the repository: `UK-to-Sri-Lanka-Relief-Donation-Hub`

### 3. Configure the Web Service

Use the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `uk-sri-lanka-relief-hub` (or your preferred name) |
| **Region** | Choose the closest to your users |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free (or paid if you prefer) |

### 4. Add Environment Variables

Click on **"Advanced"** and add the following environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `PORT` | `10000` (Render assigns this automatically) |

> ⚠️ **Important**: Make sure to use your actual MongoDB connection string from MongoDB Atlas.

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Install dependencies
   - Build your React frontend
   - Start your Express server
   - Serve your application

### 6. Access Your Application

Once deployed, your application will be available at:
```
https://uk-sri-lanka-relief-hub.onrender.com
```
(or whatever name you chose)

## Post-Deployment

### Update API Endpoint (if needed)

If you're using a custom domain or the Render URL is different, update the `storageService.ts` file:

```typescript
const API_URL = 'https://your-app-name.onrender.com/api';
```

### MongoDB Atlas Whitelist

Make sure to whitelist Render's IP addresses in MongoDB Atlas:
1. Go to MongoDB Atlas → Network Access
2. Add IP Address
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0) for simplicity
   - Or add specific Render IP ranges for better security

## Troubleshooting

### Build Fails

- Check the build logs in Render dashboard
- Ensure all dependencies are in `package.json` (not just `devDependencies`)
- Verify TypeScript compiles without errors

### MongoDB Connection Issues

- Verify your `MONGODB_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure your database user has proper permissions

### Application Not Loading

- Check the server logs in Render dashboard
- Verify the `NODE_ENV` is set to `production`
- Ensure static files are being served correctly

## Automatic Deployments

Render automatically deploys your application when you push to your main branch. To disable this:
1. Go to your service settings
2. Under "Auto-Deploy", toggle it off

## Custom Domain

To use a custom domain:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update your DNS records as instructed

## Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Check metrics: Render Dashboard → Your Service → Metrics
- Set up alerts: Render Dashboard → Your Service → Settings → Notifications

---

## Quick Reference

### Useful Commands

```bash
# Test production build locally
npm run build
npm start

# Check for TypeScript errors
npx tsc --noEmit

# View application logs (on Render)
# Go to Dashboard → Logs
```

### Environment Variables

Make sure these are set in Render:
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_connection_string`
- `PORT=10000` (automatically set by Render)

---

**🎉 Your donation hub is now live and helping connect UK donors with Sri Lankan communities in need!**
