import { z } from 'zod';

// ============================================
// Common Validators
// ============================================

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');

// ============================================
// Auth Validators
// ============================================

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// User Validators
// ============================================

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  profileImageUrl: z.string().url().optional().nullable(),
});

// ============================================
// Resume Validators
// ============================================

export const contactInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Title is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string(),
  highlights: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field is required'),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  highlights: z.array(z.string()),
});

export const updateResumeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  parsedData: z.object({
    contact: contactInfoSchema,
    summary: z.string().optional(),
    experience: z.array(experienceSchema),
    education: z.array(educationSchema),
    skills: z.array(z.string()),
    projects: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      url: z.string().optional(),
    })),
    certifications: z.array(z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      expiryDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().optional(),
    })),
  }).optional(),
  isPrimary: z.boolean().optional(),
});

// ============================================
// Job Validators
// ============================================

export const createJobSchema = z.object({
  title: z.string().min(1, 'Job title is required').max(200),
  company: z.string().min(1, 'Company is required').max(200),
  location: z.string().max(200).optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance']).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  salaryCurrency: z.string().length(3).default('USD'),
  description: z.string().min(1, 'Job description is required'),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  sourceUrl: z.string().url().optional(),
  sourcePlatform: z.enum(['linkedin', 'indeed', 'wellfound', 'greenhouse', 'lever', 'manual']).optional(),
});

// ============================================
// Application Validators
// ============================================

export const createApplicationSchema = z.object({
  jobId: objectIdSchema,
  resumeId: objectIdSchema.optional(),
  status: z.enum(['wishlist', 'applied', 'interview', 'offer', 'rejected']).default('wishlist'),
  notes: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum([
    'saved', 'applied', 'assessment', 'recruiter_screen',
    'technical_interview', 'hiring_manager', 'final_round',
    'offer', 'accepted', 'rejected', 'withdrawn'
  ]).optional(),
  resumeId: objectIdSchema.optional(),
  coverLetter: z.string().optional(),
});

export const addNoteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000),
});

// ============================================
// AI Generation Validators
// ============================================

export const generateCoverLetterSchema = z.object({
  jobId: objectIdSchema,
  resumeId: objectIdSchema,
  tone: z.enum(['professional', 'enthusiastic', 'conversational']),
  length: z.enum(['short', 'medium', 'long']),
  focusAreas: z.array(z.string()).optional(),
});

// ============================================
// Interview Validators
// ============================================

export const startInterviewSchema = z.object({
  jobId: objectIdSchema.optional(),
  type: z.enum(['hr', 'technical', 'system_design', 'behavioral', 'case_study']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message is required').max(10000),
});

// ============================================
// Pagination Validators
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// Type Exports
// ============================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type GenerateCoverLetterInput = z.infer<typeof generateCoverLetterSchema>;
export type StartInterviewInput = z.infer<typeof startInterviewSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
