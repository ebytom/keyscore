import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResume extends Document {
  userId: Types.ObjectId;
  name: string;
  filename: string;
  filePath: string;
  mimeType: string;
  size: number;
  parsedContent?: {
    fullText: string;
    skills: string[];
    experience: {
      title: string;
      company: string;
      duration: string;
      description: string;
    }[];
    education: {
      degree: string;
      institution: string;
      year: string;
    }[];
    contact?: {
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      github?: string;
    };
  };
  isDefault: boolean;
  atsScore?: number;
  lastAnalyzedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    parsedContent: {
      fullText: String,
      skills: [String],
      experience: [{
        title: String,
        company: String,
        duration: String,
        description: String,
      }],
      education: [{
        degree: String,
        institution: String,
        year: String,
      }],
      contact: {
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    lastAnalyzedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
