import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MoreVertical,
  Calendar,
  Building2,
  ExternalLink,
  Target,
  Edit,
  Trash2,
  GripVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt?: string;
  atsScore?: number;
  nextStep?: string;
  nextStepDate?: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Senior Software Engineer',
    company: 'Google',
    status: 'interview',
    appliedAt: '2024-01-15',
    atsScore: 92,
    nextStep: 'Technical Interview',
    nextStepDate: '2024-01-25',
  },
  {
    id: '2',
    jobTitle: 'Full Stack Developer',
    company: 'Stripe',
    status: 'applied',
    appliedAt: '2024-01-18',
    atsScore: 85,
  },
  {
    id: '3',
    jobTitle: 'Backend Engineer',
    company: 'Netflix',
    status: 'wishlist',
    atsScore: 78,
  },
  {
    id: '4',
    jobTitle: 'Software Engineer II',
    company: 'Microsoft',
    status: 'offer',
    appliedAt: '2024-01-10',
    atsScore: 88,
    nextStep: 'Review Offer',
    nextStepDate: '2024-01-28',
  },
  {
    id: '5',
    jobTitle: 'Frontend Developer',
    company: 'Meta',
    status: 'rejected',
    appliedAt: '2024-01-05',
    atsScore: 67,
  },
  {
    id: '6',
    jobTitle: 'Platform Engineer',
    company: 'Airbnb',
    status: 'applied',
    appliedAt: '2024-01-20',
    atsScore: 81,
  },
];

const columns: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: 'wishlist', title: 'Wishlist', color: 'bg-slate-500' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'interview', title: 'Interview', color: 'bg-yellow-500' },
  { id: 'offer', title: 'Offer', color: 'bg-green-500' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-500' },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);

  const getApplicationsByStatus = useCallback(
    (status: ApplicationStatus) => applications.filter((app) => app.status === status),
    [applications]
  );

  const moveApplication = (appId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Application Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your job applications in one place
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {columns.map((column) => {
          const count = getApplicationsByStatus(column.id).length;
          return (
            <Card key={column.id}>
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground">{column.title}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm text-muted-foreground">
                  ({getApplicationsByStatus(column.id).length})
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Content */}
            <div className="space-y-3 min-h-[200px]">
              {getApplicationsByStatus(column.id).map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow group">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                          <div>
                            <h4 className="font-medium text-sm line-clamp-1">
                              {app.jobTitle}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Building2 className="h-3 w-3" />
                              {app.company}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Job
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {columns
                              .filter((c) => c.id !== column.id)
                              .map((c) => (
                                <DropdownMenuItem
                                  key={c.id}
                                  onClick={() => moveApplication(app.id, c.id)}
                                >
                                  Move to {c.title}
                                </DropdownMenuItem>
                              ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        {app.atsScore !== undefined && (
                          <div className="flex items-center gap-1 text-xs">
                            <Target className={`h-3 w-3 ${getScoreColor(app.atsScore)}`} />
                            <span className={getScoreColor(app.atsScore)}>
                              {app.atsScore}%
                            </span>
                          </div>
                        )}
                        {app.appliedAt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(app.appliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                      </div>

                      {app.nextStep && (
                        <div className="mt-2 p-2 bg-muted rounded text-xs">
                          <div className="font-medium">{app.nextStep}</div>
                          {app.nextStepDate && (
                            <div className="text-muted-foreground mt-0.5">
                              {new Date(app.nextStepDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Empty State */}
              {getApplicationsByStatus(column.id).length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                  No applications
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
