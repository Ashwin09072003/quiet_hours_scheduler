import mongoose, { Schema, Document } from 'mongoose'

export interface IQuietHourBlock extends Document {
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

const QuietHourBlockSchema = new Schema<IQuietHourBlock>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true,
    index: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: function() {
      return this.isRecurring
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  emailSent: {
    type: Boolean,
    default: false,
    index: true
  },
  emailSentAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
QuietHourBlockSchema.index({ userId: 1, startTime: 1 })
QuietHourBlockSchema.index({ isActive: 1, emailSent: 1, startTime: 1 })

export default mongoose.models.QuietHourBlock || mongoose.model<IQuietHourBlock>('QuietHourBlock', QuietHourBlockSchema)
