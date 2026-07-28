import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';

export interface Resume {
  _id: string;
  userId: string;
  name: string;
  filename: string;
  filePath: string;
  mimeType: string;
  size: number;
  isDefault: boolean;
  atsScore?: number;
  parsedContent?: {
    contact?: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
    summary?: string;
    experience?: Array<{
      id: string;
      company: string;
      title: string;
      location?: string;
      startDate: string;
      endDate?: string;
      current: boolean;
      description: string;
      highlights: string[];
    }>;
    education?: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate?: string;
      gpa?: string;
      highlights: string[];
    }>;
    skills?: string[];
    projects?: Array<{
      id: string;
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    certifications?: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      expiryDate?: string;
      credentialId?: string;
      url?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

interface ResumesResponse {
  success: boolean;
  data: Resume[];
}

// Get all resumes
export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const { data } = await api.get<ResumesResponse>('/resumes');
      return data.data;
    },
  });
}

// Get single resume
export function useResume(resumeId: string) {
  return useQuery({
    queryKey: ['resume', resumeId],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Resume }>(`/resumes/${resumeId}`);
      return data.data;
    },
    enabled: !!resumeId,
  });
}

// Upload resume - uses POST /resumes with 'file' field
export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);  // Backend expects 'file' field
      formData.append('name', file.name.replace(/\.[^/.]+$/, '')); // Name without extension

      const { data } = await api.post<{ success: boolean; data: Resume }>('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: (error) => {
      throw handleApiError(error);
    },
  });
}

// Update resume
export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resumeId, updates }: { resumeId: string; updates: Partial<Resume> }) => {
      const { data } = await api.patch<{ success: boolean; data: Resume }>(`/resumes/${resumeId}`, updates);
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.setQueryData(['resume', data._id], data);
    },
  });
}

// Set primary resume - uses PATCH /resumes/:id with isDefault: true
export function useSetPrimaryResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      const { data } = await api.patch<{ success: boolean; data: Resume }>(`/resumes/${resumeId}`, {
        isDefault: true,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

// Delete resume
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      await api.delete(`/resumes/${resumeId}`);
      return resumeId;
    },
    onSuccess: (resumeId) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.removeQueries({ queryKey: ['resume', resumeId] });
    },
  });
}
