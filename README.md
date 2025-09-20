# Quiet Hours Scheduler

A full-stack application for scheduling quiet study time blocks with email reminders. Built with Next.js, Supabase, MongoDB, and email notifications.

## Features

- 🔐 **User Authentication** - Secure login/signup with Supabase
- 📅 **Schedule Management** - Create, edit, and delete quiet hours blocks
- 📧 **Email Reminders** - Automatic email notifications 10 minutes before each session
- 🔄 **Recurring Sessions** - Daily, weekly, or monthly recurring quiet hours
- 🚫 **Overlap Prevention** - Prevents scheduling conflicts and CRON job overlaps
- ⚡ **Real-time Updates** - Live updates using Supabase real-time features
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth with Row-Level Security
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer with SMTP
- **CRON**: Node-cron for scheduled tasks
- **Real-time**: Supabase real-time subscriptions

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Supabase account
- Email service (Gmail, SendGrid, etc.)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd quiet_hours_scheduler
npm install
```

### 2. Environment Configuration

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quiet_hours_scheduler
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/quiet_hours_scheduler

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# CRON Configuration
CRON_SECRET=your_cron_secret
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor
3. Enable email authentication in Supabase Auth settings
4. Copy your project URL and keys to `.env.local`

### 4. MongoDB Setup

#### Local MongoDB:
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

#### MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Get your connection string
3. Update `MONGODB_URI` in `.env.local`

### 5. Email Setup (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_PASS`

### 6. Run the Application

```bash
# Development mode
npm run dev

# In another terminal, run the CRON processor
npm run cron
```

The application will be available at `http://localhost:3000`

## Usage

### Creating Quiet Hours

1. Sign up for a new account or sign in
2. Navigate to the dashboard
3. Fill out the "Schedule New Quiet Hours" form:
   - Enter a title and optional description
   - Set start and end times
   - Choose if it should be recurring
4. Click "Schedule Quiet Hours"

### Managing Quiet Hours

- View all your scheduled quiet hours in the "Your Quiet Hours" section
- Activate/deactivate blocks as needed
- Delete blocks you no longer need
- See email notification status

### Email Notifications

- You'll receive an email 10 minutes before each quiet hours session
- The system prevents overlapping notifications for the same user
- Email status is tracked and displayed in the UI

## API Endpoints

### Quiet Hours
- `GET /api/quiet-hours` - Get user's quiet hours
- `POST /api/quiet-hours` - Create new quiet hours
- `PATCH /api/quiet-hours/[id]` - Update quiet hours
- `DELETE /api/quiet-hours/[id]` - Delete quiet hours

### Email Notifications
- `POST /api/email-notifications` - Schedule email notification
- `POST /api/email-notifications/cancel` - Cancel notifications

### CRON
- `POST /api/cron/process-notifications` - Process pending notifications

## CRON Job Details

The CRON system runs every minute and:

1. Finds notifications scheduled for the next 5 minutes
2. Checks for running jobs to prevent overlaps
3. Sends email reminders
4. Updates notification status
5. Handles errors gracefully

## Database Schema

### QuietHourBlock
```typescript
{
  userId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  isActive: boolean
  emailSent: boolean
  emailSentAt?: Date
}
```

### EmailNotification
```typescript
{
  userId: string
  blockId: string
  scheduledTime: Date
  sent: boolean
  sentAt?: Date
}
```

### CronJob
```typescript
{
  userId: string
  blockId: string
  scheduledTime: Date
  status: 'pending' | 'running' | 'completed' | 'failed'
}
```

## Security Features

- Row-Level Security (RLS) in Supabase
- User authentication required for all operations
- CRON job overlap prevention
- Input validation with Zod schemas
- Secure email handling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### CRON Job Deployment

For production, you'll need to run the CRON processor on a server:

1. Deploy to a VPS or use a service like Railway, Render, or Heroku
2. Set up a process manager like PM2
3. Run `npm run cron` as a background service

### Environment Variables for Production

Make sure to set all environment variables in your production environment, especially:
- `MONGODB_URI` (production MongoDB connection)
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)
- `CRON_SECRET` (for securing CRON endpoints)
- `EMAIL_*` (production email configuration)

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP credentials and app password
2. **CRON not working**: Ensure CRON processor is running and `CRON_SECRET` is set
3. **Database connection**: Verify MongoDB URI and network access
4. **Authentication errors**: Check Supabase configuration and RLS policies

### Logs

Check the console logs for detailed error messages:
- Application logs: Browser console and terminal
- CRON logs: Terminal running `npm run cron`
- Database logs: MongoDB logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
