export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

export interface QuietHourBlock {
  _id?: string
  userId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  isRecurring: boolean
  recurringPattern?: 'daily' | 'weekly' | 'monthly'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  emailSent: boolean
  emailSentAt?: Date
}

export interface EmailNotification {
  _id?: string
  userId: string
  blockId: string
  scheduledTime: Date
  sent: boolean
  sentAt?: Date
  createdAt: Date
}

export interface CronJob {
  _id?: string
  userId: string
  blockId: string
  scheduledTime: Date
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}
