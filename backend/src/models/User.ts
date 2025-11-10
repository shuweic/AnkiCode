import mongoose, { Schema, Document, Types } from 'mongoose';
import { UserSettings } from '../types';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  leetcodeUsername?: string;
  problemIds: Types.ObjectId[];
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    leetcodeUsername: {
      type: String,
      trim: true,
    },
    problemIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
    settings: {
      notifications: {
        optIn: {
          type: Boolean,
          default: true,
        },
      },
      skipWeekends: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 索引
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);

