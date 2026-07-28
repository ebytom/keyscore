import { useMutation, useQuery } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';

// ATS Score
interface ATSScoreResponse {
  success: boolean;
  data: {
    score: number;
    breakdown: {
      keywordMatch: number;
      skillsMatch: number;
      experienceMatch: number;
      educationMatch: number;
      formatting: number;
    };
    suggestions: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}

export function useATSScore() {
  return useMutation({
    mutationFn: async ({ resumeId, jobId }: { resumeId: string; jobId: string }) => {
      const { data } = await api.post<ATSScoreResponse>('/ai/ats-score', { resumeId, jobId });
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Cover Letter Generation
interface CoverLetterResponse {
  success: boolean;
  data: {
    coverLetter: string;
    highlights: string[];
  };
}

export function useGenerateCoverLetter() {
  return useMutation({
    mutationFn: async (params: {
      resumeId: string;
      jobId: string;
      tone?: 'professional' | 'enthusiastic' | 'conversational';
      length?: 'short' | 'medium' | 'long';
      focusAreas?: string[];
    }) => {
      const { data } = await api.post<CoverLetterResponse>('/ai/cover-letter', params);
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Skill Gap Analysis
interface SkillGapResponse {
  success: boolean;
  data: {
    matchingSkills: string[];
    missingSkills: string[];
    recommendations: Array<{
      skill: string;
      priority: 'high' | 'medium' | 'low';
      resources: Array<{
        title: string;
        url: string;
        type: 'course' | 'tutorial' | 'documentation';
      }>;
    }>;
    overallReadiness: number;
  };
}

export function useSkillGapAnalysis() {
  return useMutation({
    mutationFn: async ({ resumeId, jobId }: { resumeId: string; jobId: string }) => {
      const { data } = await api.post<SkillGapResponse>('/ai/skill-gap', { resumeId, jobId });
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Mock Interview
interface InterviewSession {
  _id: string;
  type: 'hr' | 'technical' | 'system_design' | 'behavioral' | 'case_study';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed';
  messages: Array<{
    role: 'interviewer' | 'candidate';
    content: string;
    timestamp: string;
  }>;
  feedback?: {
    overallScore: number;
    strengths: string[];
    improvements: string[];
    detailedFeedback: string;
  };
  createdAt: string;
}

export function useStartInterview() {
  return useMutation({
    mutationFn: async (params: {
      jobId?: string;
      type: 'hr' | 'technical' | 'system_design' | 'behavioral' | 'case_study';
      difficulty: 'easy' | 'medium' | 'hard';
    }) => {
      const { data } = await api.post<{ success: boolean; data: InterviewSession }>('/ai/interview/start', params);
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

export function useSendInterviewMessage() {
  return useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const { data } = await api.post<{ success: boolean; data: InterviewSession }>(
        `/ai/interview/${sessionId}/message`,
        { content }
      );
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

export function useEndInterview() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { data } = await api.post<{ success: boolean; data: InterviewSession }>(
        `/ai/interview/${sessionId}/end`
      );
      return data.data;
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

export function useInterviewHistory() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: InterviewSession[] }>('/ai/interview/history');
      return data.data;
    },
  });
}
