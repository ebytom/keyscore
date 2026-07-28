import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import type { CreateJobInput } from '@ajc/shared';

export interface Job {
  _id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits: string[];
  sourceUrl?: string;
  sourcePlatform?: 'linkedin' | 'indeed' | 'wellfound' | 'greenhouse' | 'lever' | 'manual';
  isSaved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface JobsFilters {
  search?: string;
  source?: string;
  saved?: boolean;
  page?: number;
  limit?: number;
}

// Get all jobs
export function useJobs(filters: JobsFilters = {}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.source) params.append('source', filters.source);
      if (filters.saved) params.append('saved', 'true');
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const { data } = await api.get<JobsResponse>(`/jobs?${params}`);
      return data;
    },
  });
}

// Get single job
export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Job }>(`/jobs/${jobId}`);
      return data.data;
    },
    enabled: !!jobId,
  });
}

// Create job
export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (job: CreateJobInput) => {
      const { data } = await api.post<{ success: boolean; data: Job }>('/jobs', job);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Update job
export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<Job> }) => {
      const { data } = await api.patch<{ success: boolean; data: Job }>(`/jobs/${jobId}`, updates);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['job', data._id], data);
    },
  });
}

// Toggle save job
export function useToggleSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      const { data } = await api.patch<{ success: boolean; data: Job }>(`/jobs/${jobId}/save`);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['job', data._id], data);
    },
  });
}

// Delete job
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: string) => {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    },
    onSuccess: (jobId) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.removeQueries({ queryKey: ['job', jobId] });
    },
  });
}
