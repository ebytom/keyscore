import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { Resume } from '../models/Resume.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';
import { parseResume } from '../services/resumeParser.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(config.upload.uploadDir, 'resumes');
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Get all resumes for user (includes skills for extension matching)
router.get('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user!._id })
      .sort({ createdAt: -1 });

    // Return resumes with skills but without full text (to save bandwidth)
    const resumesWithSkills = resumes.map(r => {
      const obj = r.toObject();
      if (obj.parsedContent) {
        // Keep skills and fullText for matching, remove other large fields
        delete obj.parsedContent.experience;
        delete obj.parsedContent.education;
      }
      return obj;
    });

    res.json({
      success: true,
      data: resumesWithSkills,
    });
  } catch (error) {
    next(error);
  }
});

// Get single resume
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
});

// Upload resume
router.post('/', authenticate, upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400, 'NO_FILE');
    }

    const { name } = req.body;

    // Check tier limits
    const resumeCount = await Resume.countDocuments({ userId: req.user!._id });
    const tierLimits = { free: 3, pro: Infinity, premium: Infinity };
    const limit = tierLimits[req.user!.tier];

    if (resumeCount >= limit) {
      // Delete uploaded file
      await fs.unlink(req.file.path);
      throw new AppError('Resume limit reached for your plan', 403, 'LIMIT_REACHED');
    }

    // Check if this should be default (first resume)
    const isDefault = resumeCount === 0;

    // Parse the resume content
    let parsedContent;
    try {
      parsedContent = await parseResume(req.file.path, req.file.mimetype);
    } catch (parseError) {
      console.error('Failed to parse resume:', parseError);
      // Continue without parsed content - we can retry later
      parsedContent = null;
    }

    const resume = await Resume.create({
      userId: req.user!._id,
      name: name || path.parse(req.file.originalname).name,
      filename: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      isDefault,
      parsedContent,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
});

// Update resume
router.patch('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { name, isDefault } = req.body;

    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    if (name) resume.name = name;

    if (isDefault === true) {
      // Unset other defaults
      await Resume.updateMany(
        { userId: req.user!._id, _id: { $ne: resume._id } },
        { isDefault: false }
      );
      resume.isDefault = true;
    }

    await resume.save();

    res.json({
      success: true,
      message: 'Resume updated',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
});

// Delete resume
router.delete('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    // Delete file from disk
    try {
      await fs.unlink(resume.filePath);
    } catch (err) {
      console.warn('Could not delete resume file:', err);
    }

    await resume.deleteOne();

    // If deleted was default, set another as default
    if (resume.isDefault) {
      const nextResume = await Resume.findOne({ userId: req.user!._id });
      if (nextResume) {
        nextResume.isDefault = true;
        await nextResume.save();
      }
    }

    res.json({
      success: true,
      message: 'Resume deleted',
    });
  } catch (error) {
    next(error);
  }
});

// Download resume file
router.get('/:id/download', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    res.download(resume.filePath, resume.filename);
  } catch (error) {
    next(error);
  }
});

export default router;
