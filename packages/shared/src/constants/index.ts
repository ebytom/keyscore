// ============================================
// Application Constants
// ============================================

export const APP_NAME = 'AI Job Search Copilot';
export const APP_DESCRIPTION = 'Your intelligent AI-powered career assistant';

// ============================================
// Tier Limits
// ============================================

export const TIER_LIMITS = {
  free: {
    resumes: 3,
    jobAnalysesPerMonth: 5,
    coverLettersPerMonth: 2,
    trackedJobs: 20,
    mockInterviewsPerMonth: 0,
  },
  pro: {
    resumes: Infinity,
    jobAnalysesPerMonth: Infinity,
    coverLettersPerMonth: Infinity,
    trackedJobs: Infinity,
    mockInterviewsPerMonth: 10,
  },
  premium: {
    resumes: Infinity,
    jobAnalysesPerMonth: Infinity,
    coverLettersPerMonth: Infinity,
    trackedJobs: Infinity,
    mockInterviewsPerMonth: Infinity,
  },
} as const;

// ============================================
// Application Status Flow
// ============================================

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'assessment',
  'recruiter_screen',
  'technical_interview',
  'hiring_manager',
  'final_round',
  'offer',
  'accepted',
  'rejected',
  'withdrawn',
] as const;

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  saved: 'Saved',
  applied: 'Applied',
  assessment: 'Assessment',
  recruiter_screen: 'Recruiter Screen',
  technical_interview: 'Technical Interview',
  hiring_manager: 'Hiring Manager',
  final_round: 'Final Round',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  saved: 'gray',
  applied: 'blue',
  assessment: 'yellow',
  recruiter_screen: 'orange',
  technical_interview: 'purple',
  hiring_manager: 'indigo',
  final_round: 'pink',
  offer: 'green',
  accepted: 'emerald',
  rejected: 'red',
  withdrawn: 'slate',
};

// ============================================
// ATS Score Weights
// ============================================

export const ATS_SCORE_WEIGHTS = {
  keywords: 0.3,
  experience: 0.25,
  education: 0.15,
  skills: 0.15,
  format: 0.15,
} as const;

export const ATS_SCORE_THRESHOLDS = {
  excellent: 85,
  good: 70,
  fair: 50,
  poor: 0,
} as const;

// ============================================
// Interview Types
// ============================================

export const INTERVIEW_TYPES = [
  { value: 'hr', label: 'HR / Behavioral' },
  { value: 'technical', label: 'Technical' },
  { value: 'system_design', label: 'System Design' },
  { value: 'behavioral', label: 'Behavioral (STAR)' },
  { value: 'case_study', label: 'Case Study' },
] as const;

export const INTERVIEW_DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const;

// ============================================
// File Upload Limits
// ============================================

export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.pdf', '.docx'],
} as const;

// ============================================
// API Endpoints
// ============================================

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_LOGOUT: '/api/v1/auth/logout',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  AUTH_FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/v1/auth/reset-password',
  AUTH_VERIFY_EMAIL: '/api/v1/auth/verify-email',

  // Users
  USERS_ME: '/api/v1/users/me',
  USERS_PROFILE: '/api/v1/users/profile',

  // Resumes
  RESUMES: '/api/v1/resumes',
  RESUME_BY_ID: (id: string) => `/api/v1/resumes/${id}`,
  RESUME_PRIMARY: '/api/v1/resumes/primary',
  RESUME_PARSE: '/api/v1/resumes/parse',

  // Jobs
  JOBS: '/api/v1/jobs',
  JOB_BY_ID: (id: string) => `/api/v1/jobs/${id}`,
  JOB_ANALYZE: (id: string) => `/api/v1/jobs/${id}/analyze`,

  // Applications
  APPLICATIONS: '/api/v1/applications',
  APPLICATION_BY_ID: (id: string) => `/api/v1/applications/${id}`,
  APPLICATION_NOTES: (id: string) => `/api/v1/applications/${id}/notes`,

  // AI Generation
  GENERATE_COVER_LETTER: '/api/v1/generate/cover-letter',
  GENERATE_RESUME_OPTIMIZE: '/api/v1/generate/resume-optimize',
  GENERATE_SKILL_GAP: '/api/v1/generate/skill-gap',

  // Interviews
  INTERVIEWS: '/api/v1/interviews',
  INTERVIEW_BY_ID: (id: string) => `/api/v1/interviews/${id}`,
  INTERVIEW_MESSAGE: (id: string) => `/api/v1/interviews/${id}/message`,
  INTERVIEW_END: (id: string) => `/api/v1/interviews/${id}/end`,

  // Dashboard
  DASHBOARD_STATS: '/api/v1/dashboard/stats',
  DASHBOARD_ACTIVITY: '/api/v1/dashboard/activity',
} as const;

// ============================================
// Error Codes
// ============================================

export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_003',
  AUTH_ACCOUNT_LOCKED: 'AUTH_004',
  AUTH_EMAIL_NOT_VERIFIED: 'AUTH_005',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_006',

  // Validation
  VALIDATION_ERROR: 'VAL_001',
  INVALID_FILE_TYPE: 'VAL_002',
  FILE_TOO_LARGE: 'VAL_003',

  // Resources
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_CONFLICT: 'RES_002',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'LIMIT_001',
  FEATURE_LIMIT_REACHED: 'LIMIT_002',

  // AI Services
  AI_SERVICE_ERROR: 'AI_001',
  AI_TIMEOUT: 'AI_002',

  // System
  INTERNAL_ERROR: 'SYS_001',
  SERVICE_UNAVAILABLE: 'SYS_002',
} as const;
