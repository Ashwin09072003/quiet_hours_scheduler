# Deployment Guide

## Vercel Deployment (Recommended)

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix Next.js 15 compatibility and deployment issues"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect it's a Next.js project

### 3. Set Environment Variables
In your Vercel dashboard, go to Settings → Environment Variables and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Next.js Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret

# CRON Configuration
CRON_SECRET=your_cron_secret
```

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## CRON Job Deployment

Since Vercel doesn't support long-running processes, you'll need to deploy the CRON job separately:

### Option 1: Railway
1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Set the same environment variables
5. Set the start command to: `npm run cron`

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the same environment variables
5. Set the start command to: `npm run cron`

### Option 3: VPS
Deploy to any VPS and run:
```bash
npm install
npm run cron
```

## Environment Variables for Production

Make sure to update these for production:

- `NEXTAUTH_URL` should be your production domain
- `MONGODB_URI` should be your production MongoDB connection
- `EMAIL_*` should be your production email settings

## Testing After Deployment

1. Visit your deployed app
2. Test sign up/sign in
3. Create a quiet hours block
4. Check if email notifications work

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Ensure MongoDB is accessible from Vercel
- Verify Supabase credentials are correct

### CRON Not Working
- Make sure the CRON service is running
- Check environment variables in the CRON service
- Verify `CRON_SECRET` is set correctly

### Email Not Sending
- Check SMTP credentials
- Verify email service allows external connections
- Test with a simple email first
