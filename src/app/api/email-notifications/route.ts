import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EmailNotification from '@/lib/models/EmailNotification'
import CronJob from '@/lib/models/CronJob'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { userId, blockId, scheduledTime } = await request.json()

    // Check if there's already a pending notification for this user at this time
    const existingNotification = await EmailNotification.findOne({
      userId,
      scheduledTime: new Date(scheduledTime),
      sent: false
    })

    if (existingNotification) {
      return NextResponse.json(
        { error: 'Notification already scheduled for this time' },
        { status: 400 }
      )
    }

    // Create email notification
    const notification = new EmailNotification({
      userId,
      blockId,
      scheduledTime: new Date(scheduledTime),
      sent: false
    })

    await notification.save()

    // Create cron job entry
    const cronJob = new CronJob({
      userId,
      blockId,
      scheduledTime: new Date(scheduledTime),
      status: 'pending'
    })

    await cronJob.save()

    return NextResponse.json({ 
      message: 'Email notification scheduled successfully',
      notificationId: notification._id,
      cronJobId: cronJob._id
    })
  } catch (error) {
    console.error('Error scheduling email notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
