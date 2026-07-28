import { Router } from 'express';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { AppError } from '../middleware/error.js';
import { createApplicationSchema } from '@keyscore/shared';

const router = Router();

// Get all applications for user
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query: any = { userId: req.user!._id };

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('jobId', 'title company location')
        .populate('resumeId', 'name')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Application.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get applications grouped by status (for Kanban board)
router.get('/kanban', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const applications = await Application.find({ userId: req.user!._id })
      .populate('jobId', 'title company location')
      .sort({ updatedAt: -1 });

    const grouped = {
      wishlist: applications.filter((a) => a.status === 'wishlist'),
      applied: applications.filter((a) => a.status === 'applied'),
      interview: applications.filter((a) => a.status === 'interview'),
      offer: applications.filter((a) => a.status === 'offer'),
      rejected: applications.filter((a) => a.status === 'rejected'),
    };

    res.json({
      success: true,
      data: grouped,
    });
  } catch (error) {
    next(error);
  }
});

// Get application stats
router.get('/stats', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const stats = await Application.aggregate([
      { $match: { userId: req.user!._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap = stats.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        wishlist: statsMap.wishlist || 0,
        applied: statsMap.applied || 0,
        interview: statsMap.interview || 0,
        offer: statsMap.offer || 0,
        rejected: statsMap.rejected || 0,
        total: Object.values(statsMap).reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single application
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    })
      .populate('jobId')
      .populate('resumeId');

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Create application
router.post('/', authenticate, validateBody(createApplicationSchema), async (req: AuthRequest, res, next) => {
  try {
    const { jobId, resumeId, status = 'wishlist', notes } = req.body;

    // Verify job exists and belongs to user
    const job = await Job.findOne({ _id: jobId, userId: req.user!._id });
    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    // Check if application already exists
    const existing = await Application.findOne({
      userId: req.user!._id,
      jobId,
    });

    if (existing) {
      throw new AppError('Application already exists for this job', 400, 'APPLICATION_EXISTS');
    }

    const application = await Application.create({
      userId: req.user!._id,
      jobId,
      resumeId,
      status,
      notes,
      appliedAt: status !== 'wishlist' ? new Date() : undefined,
      timeline: [{ status, date: new Date() }],
    });

    res.status(201).json({
      success: true,
      message: 'Application created',
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Update application status
router.patch('/:id/status', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    const previousStatus = application.status;
    application.status = status;

    // Add to timeline
    application.timeline.push({
      status,
      date: new Date(),
      notes,
    });

    // Set appliedAt if moving from wishlist
    if (previousStatus === 'wishlist' && status !== 'wishlist' && !application.appliedAt) {
      application.appliedAt = new Date();
    }

    await application.save();

    res.json({
      success: true,
      message: `Application moved to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Update application details
router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const allowedFields = ['resumeId', 'notes', 'nextStep', 'nextStepDate', 'coverLetter'];
    const updates: any = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Application updated',
      data: application,
    });
  } catch (error) {
    next(error);
  }
});

// Delete application
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!application) {
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Application deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
