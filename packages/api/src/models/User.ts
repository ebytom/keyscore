import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  tier: 'free' | 'pro' | 'premium';
  provider?: 'local' | 'google' | 'github';
  providerId?: string;
  isEmailVerified: boolean;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImageUrl: {
      type: String,
    },
    tier: {
      type: String,
      enum: ['free', 'pro', 'premium'],
      default: 'free',
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshTokens: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for OAuth lookups
userSchema.index({ provider: 1, providerId: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
