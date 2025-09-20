import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EmailNotification from '@/lib/models/EmailNotification'
import CronJob from '@/lib/models/CronJob'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { blockId } = await request.json()

    // Cancel pending email notifications for this block
    await EmailNotification.updateMany(
      { blockId, sent: false },
      { $set: { sent: true } } // Mark as sent to prevent processing
    )

    // Cancel pending cron jobs for this block
    await CronJob.updateMany(
      { blockId, status: 'pending' },
      { $set: { status: 'cancelled' } }
    )

    return NextResponse.json({ 
      message: 'Email notifications cancelled successfully' 
    })
  } catch (error) {
    console.error('Error cancelling email notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
