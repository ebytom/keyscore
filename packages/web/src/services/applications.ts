import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import type { Job } from './jobs';
import type { Resume } from './resumes';

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface Application {
  _id: string;
  userId: string;
  jobId: Job | string;
  resumeId?: Resume | string;
  status: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
  coverLetter?: string;
  nextStep?: string;
  nextStepDate?: string;
  timeline: Array<{
    status: ApplicationStatus;
    date: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsResponse {
  success: boolean;
  data: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface KanbanResponse {
  success: boolean;
  data: {
    wishlist: Application[];
    applied: Application[];
    interview: Application[];
    offer: Application[];
    rejected: Application[];
  };
}

interface StatsResponse {
  success: boolean;
  data: {
    wishlist: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
    total: number;
  };
}

// Get all applications
export function useApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: ['applications', status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : '';
      const { data } = await api.get<ApplicationsResponse>(`/applications${params}`);
      return data;
    },
  });
}

// Get applications for Kanban board
export function useKanbanApplications() {
  return useQuery({
    queryKey: ['applications', 'kanban'],
    queryFn: async () => {
      const { data } = await api.get<KanbanResponse>('/applications/kanban');
      return data.data;
    },
  });
}

// Get application stats
export function useApplicationStats() {
  return useQuery({
    queryKey: ['applications', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<StatsResponse>('/applications/stats');
      return data.data;
    },
  });
}

// Get single application
export function useApplication(applicationId: string) {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Application }>(`/applications/${applicationId}`);
      return data.data;
    },
    enabled: !!applicationId,
  });
}

// Create application
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (application: {
      jobId: string;
      resumeId?: string;
      status?: ApplicationStatus;
      notes?: string;
    }) => {
      const { data } = await api.post<{ success: boolean; data: Application }>('/applications', application);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Update application status (for Kanban drag-drop)
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, status, notes }: {
      applicationId: string;
      status: ApplicationStatus;
      notes?: string;
    }) => {
      const { data } = await api.patch<{ success: boolean; data: Application }>(
        `/applications/${applicationId}/status`,
        { status, notes }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

// Update application details
export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, updates }: {
      applicationId: string;
      updates: Partial<Application>;
    }) => {
      const { data } = await api.patch<{ success: boolean; data: Application }>(
        `/applications/${applicationId}`,
        updates
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.setQueryData(['application', data._id], data);
    },
  });
}

// Delete application
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: string) => {
      await api.delete(`/applications/${applicationId}`);
      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.removeQueries({ queryKey: ['application', applicationId] });
    },
  });
}
