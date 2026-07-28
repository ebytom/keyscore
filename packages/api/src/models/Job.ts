import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document {
  userId: Types.ObjectId;
  title: string;
  company: string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'remote' | 'internship';
  description: string;
  requirements: string[];
  skills: string[];
  source: 'linkedin' | 'indeed' | 'wellfound' | 'greenhouse' | 'lever' | 'manual';
  sourceUrl?: string;
  postedAt?: Date;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote', 'internship'],
      default: 'full-time',
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [{
      type: String,
    }],
    skills: [{
      type: String,
    }],
    source: {
      type: String,
      enum: ['linkedin', 'indeed', 'wellfound', 'greenhouse', 'lever', 'manual'],
      default: 'manual',
    },
    sourceUrl: {
      type: String,
    },
    postedAt: {
      type: Date,
    },
    isSaved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
