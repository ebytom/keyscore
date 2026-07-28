import { Router } from 'express';
import { OpenAI } from 'openai';
import { config } from '../config/index.js';
import { Resume } from '../models/Resume.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/error.js';

const router = Router();

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// ATS Score Analysis
router.post('/ats-score', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { resumeId, jobId } = req.body;

    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user!._id }),
      Job.findOne({ _id: jobId, userId: req.user!._id }),
    ]);

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    if (!resume.parsedContent?.fullText) {
      throw new AppError('Resume not parsed yet', 400, 'RESUME_NOT_PARSED');
    }

    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume against the job description and provide a detailed compatibility analysis.

RESUME:
${resume.parsedContent.fullText}

JOB DESCRIPTION:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}
Skills: ${job.skills.join(', ')}

Provide your analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "keywordMatch": <number 0-100>,
  "experienceMatch": <number 0-100>,
  "skillsMatch": <number 0-100>,
  "educationMatch": <number 0-100>,
  "suggestions": [<array of specific improvement suggestions>],
  "missingKeywords": [<array of important keywords missing from resume>],
  "matchedKeywords": [<array of keywords that match>],
  "summary": "<brief summary of the analysis>"
}

Be thorough and specific in your analysis.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    // Update application if exists
    const application = await Application.findOne({
      userId: req.user!._id,
      jobId,
    });

    if (application) {
      application.atsScore = analysis.overallScore;
      application.atsAnalysis = {
        overallScore: analysis.overallScore,
        keywordMatch: analysis.keywordMatch,
        experienceMatch: analysis.experienceMatch,
        skillsMatch: analysis.skillsMatch,
        educationMatch: analysis.educationMatch,
        suggestions: analysis.suggestions,
        missingKeywords: analysis.missingKeywords,
      };
      await application.save();
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
});

// Generate Cover Letter
router.post('/cover-letter', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { resumeId, jobId, tone = 'professional' } = req.body;

    // Check tier limits
    // TODO: Implement usage tracking

    const [resume, job] = await Promise.all([
      Resume.findOne({ _id: resumeId, userId: req.user!._id }),
      Job.findOne({ _id: jobId, userId: req.user!._id }),
    ]);

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    if (!job) {
      throw new AppError('Job not found', 404, 'JOB_NOT_FOUND');
    }

    const prompt = `
Generate a compelling cover letter for the following job application.

CANDIDATE INFORMATION (from resume):
${resume.parsedContent?.fullText || 'Resume content not available'}

JOB DETAILS:
Company: ${job.company}
Position: ${job.title}
Location: ${job.location}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}

INSTRUCTIONS:
- Tone: ${tone}
- Highlight relevant experience and skills that match the job requirements
- Show genuine interest in the company and role
- Keep it concise (around 300-400 words)
- Include a strong opening and compelling closing
- Do not start with "Dear Hiring Manager" - use a more engaging opening

Generate only the cover letter text, no additional commentary.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
    });

    const coverLetter = completion.choices[0].message.content;

    res.json({
      success: true,
      data: {
        coverLetter,
        job: {
          title: job.title,
          company: job.company,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Skill Gap Analysis
router.post('/skill-gap', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { resumeId, targetRole } = req.body;

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user!._id });

    if (!resume) {
      throw new AppError('Resume not found', 404, 'RESUME_NOT_FOUND');
    }

    const prompt = `
Analyze the skills gap for a candidate targeting the role of "${targetRole}".

CURRENT SKILLS AND EXPERIENCE (from resume):
${resume.parsedContent?.fullText || 'Resume content not available'}
Skills: ${resume.parsedContent?.skills?.join(', ') || 'Not parsed'}

Provide a comprehensive skill gap analysis in the following JSON format:
{
  "targetRole": "${targetRole}",
  "currentSkillsAnalysis": {
    "strongSkills": [<skills where candidate is proficient>],
    "moderateSkills": [<skills present but need improvement>],
    "missingSkills": [<critical skills completely missing>]
  },
  "recommendations": [
    {
      "skill": "<skill name>",
      "priority": "high|medium|low",
      "currentLevel": "none|beginner|intermediate|advanced",
      "targetLevel": "intermediate|advanced|expert",
      "learningResources": [
        {
          "type": "course|book|project|certification",
          "name": "<resource name>",
          "platform": "<platform name>",
          "estimatedTime": "<time to complete>"
        }
      ],
      "reason": "<why this skill is important for the target role>"
    }
  ],
  "roadmap": {
    "phase1": {
      "duration": "1-2 months",
      "focus": [<skills to focus on>],
      "milestones": [<specific milestones>]
    },
    "phase2": {
      "duration": "2-4 months",
      "focus": [<skills to focus on>],
      "milestones": [<specific milestones>]
    },
    "phase3": {
      "duration": "4-6 months",
      "focus": [<skills to focus on>],
      "milestones": [<specific milestones>]
    }
  },
  "estimatedTimeToReady": "<total estimated time>",
  "overallReadiness": <percentage 0-100>
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
});

// Mock Interview - Start Session
router.post('/interview/start', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { type, jobId, topic } = req.body;

    let jobContext = '';
    if (jobId) {
      const job = await Job.findOne({ _id: jobId, userId: req.user!._id });
      if (job) {
        jobContext = `
The candidate is interviewing for:
Company: ${job.company}
Position: ${job.title}
Description: ${job.description}
`;
      }
    }

    const interviewTypes: Record<string, string> = {
      hr: 'HR screening interview focusing on culture fit, motivation, and career goals',
      technical: 'Technical interview focusing on coding, system design, and problem-solving',
      behavioral: 'Behavioral interview using STAR method for past experiences and situations',
    };

    const interviewType = interviewTypes[type] || interviewTypes.behavioral;

    const systemPrompt = `
You are an experienced interviewer conducting a ${interviewType}.
${jobContext}
${topic ? `Focus area: ${topic}` : ''}

Guidelines:
- Start with a warm introduction
- Ask one question at a time
- Follow up based on candidate responses
- Provide natural conversational flow
- After each response, give brief feedback and ask the next question
- Keep track of approximately 5-7 questions for a complete interview
- At the end, provide a summary evaluation

Begin by introducing yourself and asking the first question.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Start the interview.' },
      ],
    });

    res.json({
      success: true,
      data: {
        sessionId: Date.now().toString(), // Simple session ID
        type,
        message: completion.choices[0].message.content,
        questionNumber: 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Mock Interview - Continue
router.post('/interview/continue', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { sessionId, messages, answer } = req.body;

    // Messages should be the conversation history
    const conversationHistory = messages || [];
    conversationHistory.push({ role: 'user', content: answer });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: conversationHistory,
    });

    const response = completion.choices[0].message.content;

    // Check if interview is complete (simplified check)
    const isComplete = response?.toLowerCase().includes('end of interview') ||
                       response?.toLowerCase().includes('that concludes') ||
                       conversationHistory.length > 14; // ~7 questions with answers

    res.json({
      success: true,
      data: {
        sessionId,
        message: response,
        isComplete,
        messages: [...conversationHistory, { role: 'assistant', content: response }],
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
