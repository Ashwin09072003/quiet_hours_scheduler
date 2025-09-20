import mongoose, { Schema, Document } from 'mongoose'

export interface IEmailNotification extends Document {
  userId: string
  blockId: string
  scheduledTime: Date
  sent: boolean
  sentAt?: Date
  createdAt: Date
}

const EmailNotificationSchema = new Schema<IEmailNotification>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  blockId: {
    type: String,
    required: true,
    index: true
  },
  scheduledTime: {
    type: Date,
    required: true,
    index: true
  },
  sent: {
    type: Boolean,
    default: false,
    index: true
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
EmailNotificationSchema.index({ userId: 1, scheduledTime: 1 })
EmailNotificationSchema.index({ sent: 1, scheduledTime: 1 })

export default mongoose.models.EmailNotification || mongoose.model<IEmailNotification>('EmailNotification', EmailNotificationSchema)
