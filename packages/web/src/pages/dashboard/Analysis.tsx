import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Award,
  ChevronRight,
  Play,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const analysisTools = [
  {
    id: 'ats',
    title: 'ATS Score Analysis',
    description: 'Analyze your resume against a specific job description',
    icon: Target,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'skills',
    title: 'Skill Gap Analysis',
    description: 'Identify missing skills and get learning recommendations',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    id: 'interview',
    title: 'Mock Interviews',
    description: 'Practice with AI for HR, technical, and behavioral rounds',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    id: 'learning',
    title: 'Learning Roadmap',
    description: 'Get a personalized learning path based on your goals',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
];

const recentAnalyses = [
  {
    id: '1',
    type: 'ATS Analysis',
    job: 'Senior Software Engineer at Google',
    score: 92,
    date: '2 days ago',
  },
  {
    id: '2',
    type: 'Mock Interview',
    job: 'Technical Round - System Design',
    score: 85,
    date: '3 days ago',
  },
  {
    id: '3',
    type: 'Skill Gap',
    job: 'Full Stack Developer Role',
    score: 78,
    date: '1 week ago',
  },
];

const skillGaps = [
  { skill: 'Kubernetes', importance: 'High', progress: 30 },
  { skill: 'System Design', importance: 'High', progress: 60 },
  { skill: 'GraphQL', importance: 'Medium', progress: 45 },
  { skill: 'AWS', importance: 'High', progress: 75 },
];

const interviewHistory = [
  {
    id: '1',
    type: 'Technical',
    topic: 'Data Structures & Algorithms',
    score: 88,
    duration: '45 min',
    date: '2024-01-20',
  },
  {
    id: '2',
    type: 'Behavioral',
    topic: 'Leadership & Teamwork',
    score: 92,
    duration: '30 min',
    date: '2024-01-18',
  },
  {
    id: '3',
    type: 'System Design',
    topic: 'Design a URL Shortener',
    score: 75,
    duration: '50 min',
    date: '2024-01-15',
  },
];

export default function AnalysisPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analysis & Practice</h1>
        <p className="text-muted-foreground mt-1">
          Improve your job search with AI-powered insights and practice
        </p>
      </div>

      {/* Analysis Tools Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analysisTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTool === tool.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardContent className="pt-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${tool.bgColor} mb-4`}>
                  <tool.icon className={`h-6 w-6 ${tool.color}`} />
                </div>
                <h3 className="font-semibold">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tool.description}
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Start
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>Your latest AI-powered insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Target className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{analysis.type}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {analysis.job}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}%
                      </p>
                      <p className="text-xs text-muted-foreground">{analysis.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skill Gaps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>Track your progress on key skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{skill.skill}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          skill.importance === 'High'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {skill.importance}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(skill.progress)} transition-all`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Get Learning Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interview History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mock Interview History</CardTitle>
              <CardDescription>Review your practice sessions</CardDescription>
            </div>
            <Button>
              <Play className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {interviewHistory.map((interview) => (
                <Card key={interview.id} className="bg-muted/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                        {interview.type}
                      </span>
                      <span className={`font-bold ${getScoreColor(interview.score)}`}>
                        {interview.score}%
                      </span>
                    </div>
                    <h4 className="font-medium text-sm">{interview.topic}</h4>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.duration}
                      </span>
                      <span>
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        Review
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
