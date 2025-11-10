import mongoose, { Schema, Document, Types } from 'mongoose';
import { ReminderStatus, ReminderCreatedFrom, ConfidenceLevel } from '../types';

export interface IReminder extends Document {
  _id: Types.ObjectId;
  problemId: Types.ObjectId;
  userId: Types.ObjectId;
  scheduledFor: Date;
  createdFrom: ReminderCreatedFrom;
  status: ReminderStatus;
  meta: {
    confidence?: ConfidenceLevel;
    durationSec?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    problemId: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scheduledFor: {
      type: Date,
      required: true,
      index: true,
    },
    createdFrom: {
      type: String,
      enum: ['practice', 'manual'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'snoozed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    meta: {
      confidence: {
        type: String,
        enum: ['hard', 'medium', 'easy'],
      },
      durationSec: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 复合索引
reminderSchema.index({ userId: 1, scheduledFor: 1, status: 1 });
reminderSchema.index({ problemId: 1, status: 1 });

export const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);

