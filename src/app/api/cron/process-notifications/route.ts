import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EmailNotification from '@/lib/models/EmailNotification'
import CronJob from '@/lib/models/CronJob'
import QuietHourBlock from '@/lib/models/QuietHourBlock'
import { sendQuietHoursReminder } from '@/lib/email'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Verify this is a legitimate cron request (you might want to add API key verification)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000)

    // Find notifications that should be sent now (within the next 5 minutes)
    const notifications = await EmailNotification.find({
      sent: false,
      scheduledTime: {
        $gte: now,
        $lte: fiveMinutesFromNow
      }
    })

    console.log(`Found ${notifications.length} notifications to process`)

    const results = []

    for (const notification of notifications) {
      try {
        // Check if there's already a running cron job for this user
        const runningJob = await CronJob.findOne({
          userId: notification.userId,
          status: 'running'
        })

        if (runningJob) {
          console.log(`Skipping notification for user ${notification.userId} - already running job`)
          continue
        }

        // Mark cron job as running
        await CronJob.findByIdAndUpdate(notification._id, {
          status: 'running'
        })

        // Get the quiet hours block
        const block = await QuietHourBlock.findById(notification.blockId)
        if (!block || !block.isActive) {
          console.log(`Block ${notification.blockId} not found or inactive, skipping`)
          await CronJob.findByIdAndUpdate(notification._id, {
            status: 'completed'
          })
          continue
        }

        // Get user email from Supabase
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(notification.userId)
        
        if (userError || !userData.user) {
          console.error(`Error getting user data for ${notification.userId}:`, userError)
          await CronJob.findByIdAndUpdate(notification._id, {
            status: 'failed'
          })
          continue
        }

        // Send email
        const emailResult = await sendQuietHoursReminder(
          userData.user.email!,
          userData.user.user_metadata?.name || userData.user.email!.split('@')[0],
          block.title,
          block.startTime
        )

        if (emailResult.success) {
          // Mark notification as sent
          await EmailNotification.findByIdAndUpdate(notification._id, {
            sent: true,
            sentAt: new Date()
          })

          // Update the block to mark email as sent
          await QuietHourBlock.findByIdAndUpdate(notification.blockId, {
            emailSent: true,
            emailSentAt: new Date()
          })

          // Mark cron job as completed
          await CronJob.findByIdAndUpdate(notification._id, {
            status: 'completed'
          })

          results.push({
            notificationId: notification._id,
            status: 'sent',
            messageId: emailResult.messageId
          })

          console.log(`Email sent successfully for notification ${notification._id}`)
        } else {
          console.error(`Failed to send email for notification ${notification._id}:`, emailResult.error)
          await CronJob.findByIdAndUpdate(notification._id, {
            status: 'failed'
          })

          results.push({
            notificationId: notification._id,
            status: 'failed',
            error: emailResult.error
          })
        }
      } catch (error) {
        console.error(`Error processing notification ${notification._id}:`, error)
        await CronJob.findByIdAndUpdate(notification._id, {
          status: 'failed'
        })

        results.push({
          notificationId: notification._id,
          status: 'error',
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    return NextResponse.json({
      message: 'Cron job completed',
      processed: results.length,
      results
    })
  } catch (error) {
    console.error('Error in cron job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
