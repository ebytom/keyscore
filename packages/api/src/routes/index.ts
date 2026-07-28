import { Router } from 'express';
import authRoutes from './auth.js';
import resumeRoutes from './resumes.js';
import jobRoutes from './jobs.js';
import applicationRoutes from './applications.js';
import aiRoutes from './ai.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai', aiRoutes);

export default router;
