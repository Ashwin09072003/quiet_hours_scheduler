import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import QuietHourBlock from '@/lib/models/QuietHourBlock'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    await connectDB()
    
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blocks = await QuietHourBlock.find({ 
      userId: user.id,
      isActive: true 
    }).sort({ startTime: 1 })

    return NextResponse.json(blocks)
  } catch (error) {
    console.error('Error fetching quiet hours:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, isRecurring, recurringPattern } = body

    // Validate that end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Check for overlapping blocks for the same user
    const overlappingBlock = await QuietHourBlock.findOne({
      userId: user.id,
      isActive: true,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    })

    if (overlappingBlock) {
      return NextResponse.json(
        { error: 'You already have a quiet hours block scheduled during this time' },
        { status: 400 }
      )
    }

    const block = new QuietHourBlock({
      userId: user.id,
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isRecurring,
      recurringPattern: isRecurring ? recurringPattern : undefined,
      isActive: true,
      emailSent: false
    })

    await block.save()

    // Create email notification for 10 minutes before start time
    const notificationTime = new Date(startTime)
    notificationTime.setMinutes(notificationTime.getMinutes() - 10)

    // Only schedule if the notification time is in the future
    if (notificationTime > new Date()) {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          blockId: block._id.toString(),
          scheduledTime: notificationTime,
        }),
      })
    }

    return NextResponse.json(block, { status: 201 })
  } catch (error) {
    console.error('Error creating quiet hours:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
