import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText,
  Chrome,
  Download,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useResumes } from '@/services/resumes';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: resumes = [] } = useResumes();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload your resumes and use the extension to check ATS scores
          </p>
        </div>
        <Link to="/resumes">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Manage Resumes
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Resumes</p>
                  <p className="text-3xl font-bold mt-1">{resumes.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resumes.length === 0 ? 'Upload your first resume' : 'Ready for ATS matching'}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Extension Status</p>
                  <p className="text-3xl font-bold mt-1">Ready</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Works on 50+ job sites
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Chrome className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to check your ATS score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg border bg-card">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${resumes.length > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-muted text-muted-foreground'}`}>
                  {resumes.length > 0 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Upload Your Resume</p>
                  <p className="text-sm text-muted-foreground">
                    {resumes.length > 0
                      ? `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''} uploaded`
                      : 'Upload a PDF or DOCX file to get started'
                    }
                  </p>
                  {resumes.length === 0 && (
                    <Link to="/resumes">
                      <Button size="sm" className="mt-2">
                        Upload Resume
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border bg-card">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium">Install the Extension</p>
                  <p className="text-sm text-muted-foreground">
                    Download and install our Chrome extension
                  </p>
                  <a href="/extension/keyscore-extension.zip" download>
                    <Button size="sm" variant="outline" className="mt-2">
                      <Download className="mr-2 h-3 w-3" />
                      Download Extension
                    </Button>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg border bg-card">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium">Check ATS Scores</p>
                  <p className="text-sm text-muted-foreground">
                    Open any job posting, click the extension, and see your match score instantly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>The extension analyzes job descriptions for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Auto-Detect Job Descriptions</p>
                  <p className="text-sm text-muted-foreground">
                    Works on LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, and 50+ more sites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Keyword Extraction</p>
                  <p className="text-sm text-muted-foreground">
                    Extracts 400+ technical skills, tools, and soft skills from job descriptions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Match Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Shows which keywords match your resume and which ones are missing
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Your Resumes Preview */}
      {resumes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Resumes</CardTitle>
                <CardDescription>These are available in the extension for ATS matching</CardDescription>
              </div>
              <Link to="/resumes">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {resumes.slice(0, 3).map((resume: any) => (
                  <div
                    key={resume._id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resume.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {resume.isDefault && '⭐ Primary • '}
                        {(resume.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Extension Download CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Chrome className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Get the Chrome Extension</h3>
                  <p className="text-sm text-muted-foreground">
                    Check ATS scores on any job posting with one click
                  </p>
                </div>
              </div>
              <a href="/extension/ai-job-copilot-extension.zip" download>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Extension
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
