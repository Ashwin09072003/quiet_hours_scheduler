import mongoose, { Schema, Document } from 'mongoose'

export interface ICronJob extends Document {
  userId: string
  blockId: string
  scheduledTime: Date
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
}

const CronJobSchema = new Schema<ICronJob>({
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
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
    index: true
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
CronJobSchema.index({ userId: 1, status: 1, scheduledTime: 1 })
CronJobSchema.index({ status: 1, scheduledTime: 1 })

export default mongoose.models.CronJob || mongoose.model<ICronJob>('CronJob', CronJobSchema)
