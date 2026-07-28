import mongoose, { Schema, Document, Types } from 'mongoose';

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  resumeId?: Types.ObjectId;
  status: ApplicationStatus;
  appliedAt?: Date;
  atsScore?: number;
  atsAnalysis?: {
    overallScore: number;
    keywordMatch: number;
    experienceMatch: number;
    skillsMatch: number;
    educationMatch: number;
    suggestions: string[];
    missingKeywords: string[];
  };
  coverLetter?: string;
  notes?: string;
  nextStep?: string;
  nextStepDate?: Date;
  timeline: {
    status: ApplicationStatus;
    date: Date;
    notes?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'],
      default: 'wishlist',
    },
    appliedAt: {
      type: Date,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    atsAnalysis: {
      overallScore: Number,
      keywordMatch: Number,
      experienceMatch: Number,
      skillsMatch: Number,
      educationMatch: Number,
      suggestions: [String],
      missingKeywords: [String],
    },
    coverLetter: {
      type: String,
    },
    notes: {
      type: String,
    },
    nextStep: {
      type: String,
    },
    nextStepDate: {
      type: Date,
    },
    timeline: [{
      status: {
        type: String,
        enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'],
      },
      date: {
        type: Date,
        default: Date.now,
      },
      notes: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Compound index for user's applications
applicationSchema.index({ userId: 1, status: 1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
