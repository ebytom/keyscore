import { Router } from 'express';
import { Job } from '../models/Job.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { AppError } from '../middleware/error.js';
import { createJobSchema } from '@ajc/shared';

const router = Router();

// Get all jobs for user
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { search, source, saved, page = 1, limit = 20 } = req.query;

    const query: any = { userId: req.user!._id };

    if (search) {
      query.$text = { $search: search as string };
    }

    if (source) {
      query.source = source;
    }

    if (saved === 'true') {
      query.isSaved = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Job.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
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

// Get single job
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// Create job (manual or from extension)
router.post('/', authenticate, validateBody(createJobSchema), async (req: AuthRequest, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      userId: req.user!._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// Update job
router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Job updated',
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// Toggle save job
router.patch('/:id/save', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    job.isSaved = !job.isSaved;
    await job.save();

    res.json({
      success: true,
      message: job.isSaved ? 'Job saved' : 'Job unsaved',
      data: job,
    });
  } catch (error) {
    next(error);
  }
});

// Delete job
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Job deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
