# Quick Setup Guide

## 1. Create Environment File

Create a `.env.local` file in the root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quiet_hours_scheduler

# Email Configuration (using Gmail as example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# CRON Configuration
CRON_SECRET=your_cron_secret_here
```

## 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings → API
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Set up MongoDB

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGODB_URI=mongodb://localhost:27017/quiet_hours_scheduler`

### Option B: MongoDB Atlas (Recommended)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Use: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiet_hours_scheduler`

## 4. Configure Email (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate an app password for "Mail"
4. Use your Gmail address and the app password

## 5. Generate Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate CRON secret
openssl rand -base64 32
```

## 6. Run Supabase Setup

1. Go to your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL commands

## 7. Start the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, start CRON processor
npm run cron
```

## 8. Test the Application

1. Go to `http://localhost:3000`
2. Sign up for a new account
3. Create a quiet hours block
4. Check that you receive an email 10 minutes before the scheduled time

## Troubleshooting

### "supabaseKey is required" Error
- Make sure you've created `.env.local` with the correct Supabase keys
- Restart the development server after adding environment variables

### MongoDB Connection Error
- Check that MongoDB is running (if using local)
- Verify the connection string format
- Make sure the database name is correct

### Email Not Sending
- Verify SMTP credentials
- Check that app password is correct (not your regular password)
- Test with a simple email first

### CRON Not Working
- Make sure `CRON_SECRET` is set in `.env.local`
- Check that the CRON processor is running
- Look at the terminal output for error messages
