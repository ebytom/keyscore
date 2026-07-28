// ============================================
// User Types
// ============================================

export type UserTier = 'free' | 'pro' | 'premium';
export type AuthProvider = 'email' | 'google' | 'github';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  authProvider: AuthProvider;
  tier: UserTier;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  resumeCount: number;
  jobCount: number;
  applicationCount: number;
}

// ============================================
// Resume Types
// ============================================

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface ParsedResume {
  contact: ContactInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
}

export interface Resume {
  id: string;
  userId: string;
  name: string;
  originalFileName: string;
  originalFileUrl: string;
  parsedData: ParsedResume;
  isPrimary: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Job Types
// ============================================

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type JobSource = 'linkedin' | 'indeed' | 'wellfound' | 'greenhouse' | 'lever' | 'manual';

export interface Job {
  id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  skills: string[];
  benefits?: string[];
  sourceUrl?: string;
  sourcePlatform?: JobSource;
  postedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Application Types
// ============================================

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'assessment'
  | 'recruiter_screen'
  | 'technical_interview'
  | 'hiring_manager'
  | 'final_round'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: Date;
}

export interface ApplicationReminder {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resumeId?: string;
  status: ApplicationStatus;
  atsScore?: number;
  atsAnalysis?: ATSAnalysis;
  coverLetter?: string;
  notes: ApplicationNote[];
  reminders: ApplicationReminder[];
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// ATS Analysis Types
// ============================================

export interface ATSScoreBreakdown {
  keywords: number;
  experience: number;
  education: number;
  skills: number;
  format: number;
}

export interface ATSSuggestion {
  id: string;
  category: 'keyword' | 'experience' | 'skill' | 'format' | 'other';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedScoreIncrease: number;
}

export interface ATSAnalysis {
  overallScore: number;
  breakdown: ATSScoreBreakdown;
  missingKeywords: string[];
  missingSkills: string[];
  suggestions: ATSSuggestion[];
  analyzedAt: Date;
}

// ============================================
// Interview Types
// ============================================

export type InterviewType = 'hr' | 'technical' | 'system_design' | 'behavioral' | 'case_study';
export type InterviewDifficulty = 'easy' | 'medium' | 'hard';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';

export interface InterviewMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: Date;
}

export interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  jobId?: string;
  type: InterviewType;
  difficulty: InterviewDifficulty;
  status: InterviewStatus;
  messages: InterviewMessage[];
  feedback?: InterviewFeedback;
  duration?: number;
  startedAt: Date;
  completedAt?: Date;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: Required<Pick<ApiMeta, 'page' | 'limit' | 'total' | 'hasMore'>>;
}

// ============================================
// Request Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  authProvider: AuthProvider;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  benefits?: string[];
  sourceUrl?: string;
  sourcePlatform?: JobSource;
}

export interface UpdateApplicationRequest {
  status?: ApplicationStatus;
  resumeId?: string;
  coverLetter?: string;
}

export interface GenerateCoverLetterRequest {
  jobId: string;
  resumeId: string;
  tone: 'professional' | 'enthusiastic' | 'conversational';
  length: 'short' | 'medium' | 'long';
  focusAreas?: string[];
}

export interface StartInterviewRequest {
  jobId?: string;
  type: InterviewType;
  difficulty: InterviewDifficulty;
}
