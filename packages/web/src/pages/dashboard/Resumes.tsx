import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Upload,
  FileText,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Target,
  Star,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResumes, useUploadResume, useDeleteResume, useSetPrimaryResume } from '@/services/resumes';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ResumesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: resumes = [], isLoading, refetch } = useResumes();
  const uploadMutation = useUploadResume();
  const deleteMutation = useDeleteResume();
  const setPrimaryMutation = useSetPrimaryResume();

  const filteredResumes = resumes.filter(
    (resume) =>
      resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resume.filename || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
      toast.success('Resume uploaded successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to upload resume');
    }
  };

  const handleDelete = async (resumeId: string, resumeName: string) => {
    if (!confirm(`Are you sure you want to delete "${resumeName}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(resumeId);
      toast.success('Resume deleted');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete resume');
    }
  };

  const handleSetPrimary = async (resumeId: string) => {
    try {
      await setPrimaryMutation.mutateAsync(resumeId);
      toast.success('Primary resume updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to set primary resume');
    }
  };

  const handleView = (resumeId: string, mimeType: string) => {
    // Open file in new browser tab for viewing
    const token = localStorage.getItem('auth-storage');
    const authData = token ? JSON.parse(token) : null;
    const accessToken = authData?.state?.accessToken;

    fetch(`${API_URL}/resumes/${resumeId}/download`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const blobWithType = new Blob([blob], { type: mimeType });
        const url = window.URL.createObjectURL(blobWithType);
        window.open(url, '_blank');
        // Revoke after a delay to allow the tab to load
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      })
      .catch(() => {
        toast.error('Failed to open resume');
      });
  };

  const handleDownload = (resumeId: string, filename: string) => {
    // Download file with proper filename
    const token = localStorage.getItem('auth-storage');
    const authData = token ? JSON.parse(token) : null;
    const accessToken = authData?.state?.accessToken;

    fetch(`${API_URL}/resumes/${resumeId}/download`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast.error('Failed to download resume');
      });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Resumes</h1>
          <p className="text-muted-foreground mt-1">
            Manage and optimize your resumes for better ATS scores
          </p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Upload Resume
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">Drop your resume here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse (PDF, DOCX up to 10MB)
          </p>
          <Button variant="outline" onClick={(e) => e.stopPropagation()}>
            <Upload className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      </motion.div>

      {/* Resumes Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResumes.map((resume, index) => (
          <motion.div
            key={resume._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="group relative overflow-hidden">
              {resume.isDefault && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Primary
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate">{resume.name}</CardTitle>
                      <CardDescription className="text-xs truncate">
                        {resume.filename} • {formatFileSize(resume.size || 0)}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(resume._id, resume.mimeType)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(resume._id, resume.filename)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      {!resume.isDefault && (
                        <DropdownMenuItem onClick={() => handleSetPrimary(resume._id)}>
                          <Star className="mr-2 h-4 w-4" />
                          Set as Primary
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Target className="mr-2 h-4 w-4" />
                        Analyze
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(resume._id, resume.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                  {resume.atsScore !== undefined ? (
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                        resume.atsScore
                      )}`}
                    >
                      <Target className="h-3 w-3" />
                      {resume.atsScore}%
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Analyze
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: filteredResumes.length * 0.1 }}
        >
          <Card
            className="border-dashed hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer h-full min-h-[180px] flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">Add New Resume</p>
              <p className="text-sm text-muted-foreground mt-1">Upload or create a new resume</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Empty State */}
      {resumes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">No resumes yet</h3>
          <p className="text-muted-foreground mb-4">Upload your first resume to get started</p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      )}

      {/* No Results State */}
      {filteredResumes.length === 0 && resumes.length > 0 && searchQuery && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">No resumes found</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
