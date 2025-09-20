import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import QuietHourBlock from '@/lib/models/QuietHourBlock'
import { getCurrentUser } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB()
    
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { isActive } = body

    const block = await QuietHourBlock.findOneAndUpdate(
      { _id: id, userId: user.id },
      { isActive },
      { new: true }
    )

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    return NextResponse.json(block)
  } catch (error) {
    console.error('Error updating quiet hours:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB()
    
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const block = await QuietHourBlock.findOneAndDelete({
      _id: id,
      userId: user.id
    })

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 })
    }

    // Cancel any pending email notifications for this block
    await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/email-notifications/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blockId: id,
      }),
    })

    return NextResponse.json({ message: 'Block deleted successfully' })
  } catch (error) {
    console.error('Error deleting quiet hours:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
