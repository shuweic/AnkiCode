import mongoose, { Schema, Document, Types } from 'mongoose';
import { ProblemStatus, ConfidenceEntry } from '../types';

export interface IProblem extends Document {
  _id: Types.ObjectId;
  leetcodeId: number; // LeetCode problem number
  titleSlug: string; // LeetCode URL slug
  name: string;
  difficulty: string; // Easy/Medium/Hard
  deadline: Date;
  notes: string;
  tags: string[];
  status: ProblemStatus;
  lastPracticedAt?: Date;
  confidenceHistory: ConfidenceEntry[];
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    leetcodeId: {
      type: Number,
      required: [true, 'LeetCode problem number is required'],
    },
    titleSlug: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Problem name is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    notes: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    lastPracticedAt: {
      type: Date,
    },
    confidenceHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        level: {
          type: String,
          enum: ['hard', 'medium', 'easy'],
          required: true,
        },
      },
    ],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 索引
problemSchema.index({ ownerId: 1, leetcodeId: 1 }, { unique: true }); // 用户不能重复添加同一题
problemSchema.index({ deadline: 1 });
problemSchema.index({ status: 1 });
problemSchema.index({ updatedAt: -1 });
problemSchema.index({ name: 'text', notes: 'text' });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);

