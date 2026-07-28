import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

// Common skills to detect in resumes
const SKILL_KEYWORDS = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r',
  // Frontend
  'react', 'reactjs', 'angular', 'vue', 'vuejs', 'next.js', 'nextjs', 'svelte', 'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap', 'jquery',
  // Backend
  'node.js', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'rails', '.net', 'asp.net', 'laravel',
  // Databases
  'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'sql', 'oracle', 'sqlite', 'firebase',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions', 'gitlab', 'circleci',
  // APIs & Architecture
  'rest', 'restful', 'graphql', 'grpc', 'microservices', 'api', 'websocket', 'oauth', 'jwt', 'soap',
  // Data & AI/ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'data science', 'nlp', 'computer vision', 'ai',
  // Tools
  'git', 'github', 'jira', 'confluence', 'linux', 'unix', 'bash', 'powershell', 'vim', 'vscode',
  // Testing
  'jest', 'mocha', 'cypress', 'selenium', 'pytest', 'junit', 'testing', 'unit testing', 'tdd', 'bdd',
  // Mobile
  'react native', 'flutter', 'ios', 'android', 'xamarin',
  // Other
  'agile', 'scrum', 'kanban', 'devops', 'sre', 'security', 'encryption',
];

export interface ParsedResumeContent {
  fullText: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
}

/**
 * Parse a resume file and extract structured content
 */
export async function parseResume(filePath: string, mimeType: string): Promise<ParsedResumeContent> {
  let text = '';

  if (mimeType === 'application/pdf') {
    text = await parsePDF(filePath);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await parseDOCX(filePath);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }

  // Extract structured data from text
  const skills = extractSkills(text);
  const contact = extractContact(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);

  return {
    fullText: text,
    skills,
    experience,
    education,
    contact,
  };
}

/**
 * Parse PDF file to text
 */
async function parsePDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

/**
 * Parse DOCX file to text
 */
async function parseDOCX(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

/**
 * Extract skills from resume text
 */
function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills: string[] = [];

  SKILL_KEYWORDS.forEach(skill => {
    // Use word boundary matching
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      // Capitalize properly for display
      const displayName = skill.split(' ').map(w => {
        // Handle special cases
        if (w === 'javascript') return 'JavaScript';
        if (w === 'typescript') return 'TypeScript';
        if (w === 'nodejs' || w === 'node.js') return 'Node.js';
        if (w === 'reactjs') return 'React';
        if (w === 'vuejs') return 'Vue.js';
        if (w === 'nextjs' || w === 'next.js') return 'Next.js';
        if (w === 'postgresql' || w === 'postgres') return 'PostgreSQL';
        if (w === 'mongodb') return 'MongoDB';
        if (w === 'mysql') return 'MySQL';
        if (w === 'graphql') return 'GraphQL';
        if (w === 'aws') return 'AWS';
        if (w === 'gcp') return 'GCP';
        if (w === 'ci/cd') return 'CI/CD';
        if (w === 'k8s') return 'Kubernetes';
        if (w === 'ai') return 'AI';
        if (w === 'ml') return 'ML';
        if (w === 'nlp') return 'NLP';
        if (w === 'api') return 'API';
        if (w === 'rest' || w === 'restful') return 'REST';
        if (w === 'jwt') return 'JWT';
        if (w === 'oauth') return 'OAuth';
        if (w === 'html') return 'HTML';
        if (w === 'css') return 'CSS';
        if (w === 'sass' || w === 'scss') return 'Sass';
        if (w === 'sql') return 'SQL';
        if (w === 'nosql') return 'NoSQL';
        if (w === 'ios') return 'iOS';
        if (w === 'tdd') return 'TDD';
        if (w === 'bdd') return 'BDD';
        if (w === 'sre') return 'SRE';
        if (w === 'devops') return 'DevOps';
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join(' ');

      if (!foundSkills.includes(displayName)) {
        foundSkills.push(displayName);
      }
    }
  });

  return foundSkills;
}

/**
 * Extract contact information
 */
function extractContact(text: string): ParsedResumeContent['contact'] {
  const contact: ParsedResumeContent['contact'] = {};

  // Email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) contact.linkedin = `https://${linkedinMatch[0]}`;

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) contact.github = `https://${githubMatch[0]}`;

  return contact;
}

/**
 * Extract work experience (basic extraction)
 */
function extractExperience(text: string): ParsedResumeContent['experience'] {
  // This is a simplified extraction - real implementation would use NLP
  const experience: ParsedResumeContent['experience'] = [];

  // Look for common job title patterns
  const titlePatterns = [
    /(?:senior|junior|lead|principal|staff)?\s*(?:software|frontend|backend|full[- ]?stack|web|mobile|data|devops|cloud|ml|ai)?\s*(?:engineer|developer|architect|scientist|analyst)/gi,
  ];

  // For now, return empty - full NLP parsing would be needed
  return experience;
}

/**
 * Extract education (basic extraction)
 */
function extractEducation(text: string): ParsedResumeContent['education'] {
  const education: ParsedResumeContent['education'] = [];

  // Look for degree patterns
  const degreePatterns = [
    /(?:bachelor'?s?|master'?s?|ph\.?d\.?|b\.?s\.?|m\.?s\.?|b\.?e\.?|m\.?e\.?|b\.?tech|m\.?tech)\s+(?:of|in)?\s*(?:science|arts|engineering|computer science|information technology)?/gi,
  ];

  // For now, return empty - full NLP parsing would be needed
  return education;
}
