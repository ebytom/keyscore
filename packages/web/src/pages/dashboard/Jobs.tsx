import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Target,
  MoreVertical,
  Plus,
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

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  postedAt: string;
  source: 'linkedin' | 'indeed' | 'greenhouse' | 'lever' | 'wellfound';
  atsScore?: number;
  isSaved: boolean;
  description: string;
  skills: string[];
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$180k - $250k',
    type: 'Full-time',
    postedAt: '2 days ago',
    source: 'linkedin',
    atsScore: 92,
    isSaved: true,
    description: 'Join our team to build the next generation of cloud infrastructure...',
    skills: ['Python', 'Go', 'Kubernetes', 'GCP'],
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    postedAt: '3 days ago',
    source: 'greenhouse',
    atsScore: 85,
    isSaved: true,
    description: 'Help build the economic infrastructure of the internet...',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Netflix',
    location: 'Remote',
    salary: '$170k - $220k',
    type: 'Remote',
    postedAt: '1 week ago',
    source: 'lever',
    atsScore: 78,
    isSaved: false,
    description: 'Build scalable systems that serve millions of users...',
    skills: ['Java', 'Spring Boot', 'AWS', 'Kafka'],
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    salary: '$160k - $210k',
    type: 'Full-time',
    postedAt: '5 days ago',
    source: 'wellfound',
    isSaved: false,
    description: 'Create beautiful, responsive experiences for travelers...',
    skills: ['React', 'TypeScript', 'GraphQL', 'CSS'],
  },
];

const sourceLogos: Record<string, string> = {
  linkedin: '🔗',
  indeed: '📋',
  greenhouse: '🌿',
  lever: '⚙️',
  wellfound: '👼',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleSave = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Browse and analyze job listings from multiple sources
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Job URL
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, or skills..."
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{jobs.filter((j) => j.isSaved).length}</div>
            <div className="text-sm text-muted-foreground">Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{jobs.filter((j) => j.atsScore && j.atsScore >= 80).length}</div>
            <div className="text-sm text-muted-foreground">High Match</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="text-2xl font-bold">{jobs.filter((j) => !j.atsScore).length}</div>
            <div className="text-sm text-muted-foreground">Not Analyzed</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-lg">
                        {job.company.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <span className="text-sm" title={job.source}>
                            {sourceLogos[job.source]}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {job.salary}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.postedAt}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-muted rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    {job.atsScore !== undefined ? (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getScoreColor(job.atsScore)}`}>
                        <Target className="h-4 w-4" />
                        {job.atsScore}% Match
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Target className="mr-2 h-4 w-4" />
                        Analyze
                      </Button>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(job.id)}
                        className={job.isSaved ? 'text-primary' : ''}
                      >
                        {job.isSaved ? (
                          <BookmarkCheck className="h-5 w-5" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Add to Tracker</DropdownMenuItem>
                          <DropdownMenuItem>Generate Cover Letter</DropdownMenuItem>
                          <DropdownMenuItem>Optimize Resume</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">No jobs found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Start by adding jobs using the Chrome extension or paste a job URL'}
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Job URL
          </Button>
        </div>
      )}
    </div>
  );
}
