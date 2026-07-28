# Software Requirements Specification (SRS)
# AI Job Search Copilot

**Version:** 1.0.0  
**Last Updated:** 2026-07-27  
**Status:** Draft  
**Document ID:** SRS-AJSC-001

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features & Requirements](#3-system-features--requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [User Stories & Acceptance Criteria](#6-user-stories--acceptance-criteria)
7. [Use Cases](#7-use-cases)
8. [Data Requirements](#8-data-requirements)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the functional and non-functional requirements for the AI Job Search Copilot platform. It serves as the primary reference for technical teams during design, development, and testing phases.

### 1.2 Scope

The AI Job Search Copilot is a web-based SaaS platform with an accompanying Chrome browser extension. The system provides:

- Intelligent resume analysis and optimization
- Automated job posting extraction and analysis
- ATS compatibility scoring
- AI-powered document generation (cover letters, resumes)
- Mock interview preparation
- Job application tracking and management
- Career coaching and skill development guidance

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| ATS | Applicant Tracking System - Software used by employers to filter job applications |
| RAG | Retrieval-Augmented Generation - AI pattern combining document retrieval with LLM generation |
| LLM | Large Language Model - AI models capable of understanding and generating human language |
| JWT | JSON Web Token - Secure method for transmitting information between parties |
| RBAC | Role-Based Access Control - Security model restricting system access based on roles |
| SSO | Single Sign-On - Authentication allowing one set of credentials for multiple applications |
| PWA | Progressive Web App - Web application with native app-like capabilities |
| CRUD | Create, Read, Update, Delete - Basic data operations |
| API | Application Programming Interface |
| REST | Representational State Transfer - Architectural style for web services |
| CORS | Cross-Origin Resource Sharing - Security mechanism for web browsers |
| CSRF | Cross-Site Request Forgery - Type of malicious exploit |
| XSS | Cross-Site Scripting - Type of security vulnerability |

### 1.4 References

| Document | Description |
|----------|-------------|
| PRD.md | Product Requirements Document |
| HLD.md | High-Level Design Document |
| LLD.md | Low-Level Design Document |
| API.md | API Documentation |

### 1.5 Document Conventions

- **SHALL** - Mandatory requirement
- **SHOULD** - Recommended requirement
- **MAY** - Optional requirement
- **[Pn]** - Priority level (P0 = Critical, P1 = High, P2 = Medium, P3 = Low)
- **[MVP]** - Required for Minimum Viable Product

---

## 2. Overall Description

### 2.1 Product Perspective

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              System Context                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌──────────────┐         ┌─────────────────────────────────────────┐    │
│    │    Users     │         │        AI Job Search Copilot            │    │
│    │              │         │  ┌─────────────────────────────────┐    │    │
│    │ • Job Seeker │◄───────►│  │         Web Application         │    │    │
│    │ • Admin      │         │  │    (Next.js + React + Node)     │    │    │
│    └──────────────┘         │  └─────────────────────────────────┘    │    │
│                             │                  │                      │    │
│    ┌──────────────┐         │                  ▼                      │    │
│    │   Browser    │         │  ┌─────────────────────────────────┐    │    │
│    │  Extension   │◄───────►│  │         Backend API             │    │    │
│    │  (Chrome)    │         │  │    (Express + MongoDB)          │    │    │
│    └──────────────┘         │  └─────────────────────────────────┘    │    │
│                             │                  │                      │    │
│                             │                  ▼                      │    │
│    ┌──────────────┐         │  ┌─────────────────────────────────┐    │    │
│    │  External    │         │  │         AI Services             │    │    │
│    │  Services    │◄───────►│  │  (LangGraph + OpenAI + Qdrant)  │    │    │
│    │              │         │  └─────────────────────────────────┘    │    │
│    │ • OpenAI     │         │                                        │    │
│    │ • Clerk      │         └────────────────────────────────────────┘    │
│    │ • S3         │                                                       │
│    │ • Job Sites  │                                                       │
│    └──────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Product Features Summary

| Feature Category | Features |
|-----------------|----------|
| Authentication | Registration, Login, OAuth (Google/GitHub), Password Reset, MFA |
| Resume Management | Upload, Parse, Store, Version, Compare, Export |
| Job Analysis | Extract, Analyze, Match, Score, Track |
| AI Generation | Cover Letters, Resume Optimization, Interview Prep |
| Job Tracking | Pipeline Management, Reminders, Notes, Analytics |
| Career Tools | Skill Gap Analysis, Learning Paths, Company Research |
| Browser Extension | Job Detection, Quick Analysis, One-Click Save |

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency | Access Level |
|------------|-------------|----------------------|--------------|
| Free User | Basic platform access | Low to Medium | Limited features |
| Pro User | Paid subscriber (Pro tier) | Low to High | Full AI features |
| Premium User | Paid subscriber (Premium tier) | Low to High | All features + priority |
| Administrator | Platform management | High | Full system access |

### 2.4 Operating Environment

#### Client Requirements
- **Web Application:**
  - Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
  - JavaScript enabled
  - Minimum 1024x768 resolution
  - Stable internet connection (1 Mbps+)

- **Browser Extension:**
  - Google Chrome 88+ (Manifest V3 support)
  - Chromium-based browsers (Edge, Brave, Opera)

#### Server Requirements
- **Application Servers:**
  - Node.js 20 LTS
  - 4+ CPU cores, 8GB+ RAM per instance
  
- **Database Servers:**
  - MongoDB 7.0+
  - Redis 7.0+
  - Qdrant 1.7+

### 2.5 Design and Implementation Constraints

| Constraint | Description |
|------------|-------------|
| Technology Stack | MERN stack (MongoDB, Express, React, Node.js) as primary |
| Browser Extension | Must comply with Chrome Manifest V3 requirements |
| AI Provider | OpenAI GPT-4 for primary LLM capabilities |
| Authentication | Must support OAuth 2.0 for social logins |
| File Storage | Maximum 10MB per resume upload |
| Response Time | AI operations must complete within 30 seconds |
| Data Residency | User data stored in US regions (initially) |

### 2.6 Assumptions and Dependencies

#### Assumptions
1. Users have valid email addresses for registration
2. Users have access to modern web browsers
3. Job posting sites maintain consistent DOM structures
4. OpenAI API remains available and pricing stable
5. Users consent to AI processing of their documents

#### Dependencies
| Dependency | Type | Risk Level |
|------------|------|------------|
| OpenAI API | External Service | Medium |
| Clerk Auth | External Service | Low |
| MongoDB Atlas | Infrastructure | Low |
| AWS S3 | Infrastructure | Low |
| Qdrant Cloud | Infrastructure | Medium |
| Job Sites DOM | External | High |

---

## 3. System Features & Requirements

### 3.1 Authentication & User Management

#### 3.1.1 User Registration
**ID:** FR-AUTH-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-AUTH-001.1 | System SHALL allow users to register with email and password |
| FR-AUTH-001.2 | System SHALL validate email format and uniqueness |
| FR-AUTH-001.3 | System SHALL enforce password requirements (min 8 chars, 1 uppercase, 1 number, 1 special) |
| FR-AUTH-001.4 | System SHALL send email verification upon registration |
| FR-AUTH-001.5 | System SHALL support OAuth registration via Google |
| FR-AUTH-001.6 | System SHALL support OAuth registration via GitHub |
| FR-AUTH-001.7 | System SHALL create default user profile upon successful registration |
| FR-AUTH-001.8 | System SHALL assign "Free" tier by default to new users |

#### 3.1.2 User Authentication
**ID:** FR-AUTH-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-AUTH-002.1 | System SHALL authenticate users via email/password |
| FR-AUTH-002.2 | System SHALL authenticate users via OAuth providers |
| FR-AUTH-002.3 | System SHALL issue JWT tokens upon successful authentication |
| FR-AUTH-002.4 | System SHALL support refresh token rotation |
| FR-AUTH-002.5 | System SHALL implement session timeout after 24 hours of inactivity |
| FR-AUTH-002.6 | System SHALL support "Remember Me" functionality (30 days) |
| FR-AUTH-002.7 | System SHALL log all authentication attempts |
| FR-AUTH-002.8 | System SHALL lock accounts after 5 failed login attempts |

#### 3.1.3 Password Management
**ID:** FR-AUTH-003  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-AUTH-003.1 | System SHALL allow users to reset password via email |
| FR-AUTH-003.2 | System SHALL generate secure, time-limited reset tokens (1 hour) |
| FR-AUTH-003.3 | System SHALL allow users to change password when authenticated |
| FR-AUTH-003.4 | System SHALL prevent reuse of last 5 passwords |
| FR-AUTH-003.5 | System SHALL notify users of password changes via email |

#### 3.1.4 User Profile Management
**ID:** FR-AUTH-004  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-AUTH-004.1 | System SHALL allow users to view their profile |
| FR-AUTH-004.2 | System SHALL allow users to update profile information |
| FR-AUTH-004.3 | System SHALL allow users to upload profile photo |
| FR-AUTH-004.4 | System SHALL allow users to set notification preferences |
| FR-AUTH-004.5 | System SHALL allow users to delete their account |
| FR-AUTH-004.6 | System SHALL export user data upon request (GDPR) |

---

### 3.2 Resume Management

#### 3.2.1 Resume Upload
**ID:** FR-RES-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-RES-001.1 | System SHALL accept PDF resume uploads |
| FR-RES-001.2 | System SHALL accept DOCX resume uploads |
| FR-RES-001.3 | System SHALL validate file size (max 10MB) |
| FR-RES-001.4 | System SHALL validate file type via MIME type and magic bytes |
| FR-RES-001.5 | System SHALL scan uploads for malware |
| FR-RES-001.6 | System SHALL provide upload progress indication |
| FR-RES-001.7 | System SHALL store original file securely in S3 |
| FR-RES-001.8 | System SHALL limit free users to 3 resume uploads |
| FR-RES-001.9 | System SHALL allow unlimited uploads for paid users |

#### 3.2.2 Resume Parsing
**ID:** FR-RES-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-RES-002.1 | System SHALL extract contact information (name, email, phone, location, LinkedIn) |
| FR-RES-002.2 | System SHALL extract professional summary/objective |
| FR-RES-002.3 | System SHALL extract work experience (company, title, dates, descriptions) |
| FR-RES-002.4 | System SHALL extract education (institution, degree, field, dates, GPA) |
| FR-RES-002.5 | System SHALL extract skills (technical and soft skills) |
| FR-RES-002.6 | System SHALL extract certifications |
| FR-RES-002.7 | System SHALL extract projects |
| FR-RES-002.8 | System SHALL handle multi-column layouts |
| FR-RES-002.9 | System SHALL achieve 95%+ accuracy on standard formats |
| FR-RES-002.10 | System SHALL allow manual correction of parsed data |

#### 3.2.3 Resume Storage & Versioning
**ID:** FR-RES-003  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-RES-003.1 | System SHALL store parsed resume data in database |
| FR-RES-003.2 | System SHALL generate embeddings for semantic search |
| FR-RES-003.3 | System SHALL store embeddings in vector database |
| FR-RES-003.4 | System SHALL support multiple resume versions per user |
| FR-RES-003.5 | System SHALL allow naming/labeling resume versions |
| FR-RES-003.6 | System SHALL track version history with timestamps |
| FR-RES-003.7 | System SHALL allow setting a "primary" resume |
| FR-RES-003.8 | System SHALL support soft delete with 30-day recovery |

#### 3.2.4 Resume Comparison
**ID:** FR-RES-004  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-RES-004.1 | System SHALL compare two resume versions side-by-side |
| FR-RES-004.2 | System SHALL highlight differences between versions |
| FR-RES-004.3 | System SHALL provide diff statistics (additions, removals, changes) |
| FR-RES-004.4 | System SHALL compare against job-optimized versions |

#### 3.2.5 Resume Export
**ID:** FR-RES-005  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-RES-005.1 | System SHALL export resume as PDF |
| FR-RES-005.2 | System SHALL export resume as DOCX |
| FR-RES-005.3 | System SHALL export resume as plain text |
| FR-RES-005.4 | System SHALL apply consistent formatting to exports |
| FR-RES-005.5 | System SHALL support custom export templates (Premium) |

---

### 3.3 Job Analysis & Extraction

#### 3.3.1 Job Detection (Extension)
**ID:** FR-JOB-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-JOB-001.1 | Extension SHALL detect job postings on LinkedIn Jobs |
| FR-JOB-001.2 | Extension SHALL detect job postings on Indeed |
| FR-JOB-001.3 | Extension SHALL detect job postings on Wellfound |
| FR-JOB-001.4 | Extension SHALL detect job postings on Greenhouse boards |
| FR-JOB-001.5 | Extension SHALL detect job postings on Lever boards |
| FR-JOB-001.6 | Extension SHALL display indicator when job detected |
| FR-JOB-001.7 | Extension SHALL work without page reload |
| FR-JOB-001.8 | Extension SHALL handle dynamic content loading |

#### 3.3.2 Job Data Extraction
**ID:** FR-JOB-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-JOB-002.1 | System SHALL extract job title |
| FR-JOB-002.2 | System SHALL extract company name |
| FR-JOB-002.3 | System SHALL extract job location |
| FR-JOB-002.4 | System SHALL extract job type (full-time, part-time, contract) |
| FR-JOB-002.5 | System SHALL extract salary information (if available) |
| FR-JOB-002.6 | System SHALL extract required skills |
| FR-JOB-002.7 | System SHALL extract preferred skills |
| FR-JOB-002.8 | System SHALL extract experience requirements |
| FR-JOB-002.9 | System SHALL extract education requirements |
| FR-JOB-002.10 | System SHALL extract job responsibilities |
| FR-JOB-002.11 | System SHALL extract benefits information |
| FR-JOB-002.12 | System SHALL extract posting date |
| FR-JOB-002.13 | System SHALL store source URL |

#### 3.3.3 Manual Job Entry
**ID:** FR-JOB-003  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-JOB-003.1 | System SHALL allow manual job entry via web form |
| FR-JOB-003.2 | System SHALL allow pasting job description text |
| FR-JOB-003.3 | System SHALL parse pasted text to extract structured data |
| FR-JOB-003.4 | System SHALL allow editing of extracted data |

---

### 3.4 ATS Match Scoring

#### 3.4.1 Score Calculation
**ID:** FR-ATS-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-ATS-001.1 | System SHALL calculate overall ATS match score (0-100) |
| FR-ATS-001.2 | System SHALL calculate keyword match score |
| FR-ATS-001.3 | System SHALL calculate experience alignment score |
| FR-ATS-001.4 | System SHALL calculate education match score |
| FR-ATS-001.5 | System SHALL calculate skills relevance score |
| FR-ATS-001.6 | System SHALL calculate format compatibility score |
| FR-ATS-001.7 | System SHALL weight dimensions according to role type |
| FR-ATS-001.8 | System SHALL complete scoring within 10 seconds |

#### 3.4.2 Score Analysis
**ID:** FR-ATS-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-ATS-002.1 | System SHALL identify missing required keywords |
| FR-ATS-002.2 | System SHALL identify missing required skills |
| FR-ATS-002.3 | System SHALL identify experience gaps |
| FR-ATS-002.4 | System SHALL identify formatting issues |
| FR-ATS-002.5 | System SHALL provide score breakdown by dimension |
| FR-ATS-002.6 | System SHALL rank issues by impact on score |

#### 3.4.3 Score Improvement Suggestions
**ID:** FR-ATS-003  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-ATS-003.1 | System SHALL generate actionable improvement suggestions |
| FR-ATS-003.2 | System SHALL prioritize suggestions by score impact |
| FR-ATS-003.3 | System SHALL provide specific wording recommendations |
| FR-ATS-003.4 | System SHALL estimate score improvement per suggestion |
| FR-ATS-003.5 | System SHALL limit suggestions to top 10 most impactful |

---

### 3.5 AI Document Generation

#### 3.5.1 Cover Letter Generation
**ID:** FR-GEN-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-GEN-001.1 | System SHALL generate cover letter based on resume and job |
| FR-GEN-001.2 | System SHALL support tone selection (professional, enthusiastic, conversational) |
| FR-GEN-001.3 | System SHALL support length selection (short, medium, long) |
| FR-GEN-001.4 | System SHALL incorporate company research when available |
| FR-GEN-001.5 | System SHALL highlight relevant experience and skills |
| FR-GEN-001.6 | System SHALL allow specifying achievements to emphasize |
| FR-GEN-001.7 | System SHALL generate within 15 seconds |
| FR-GEN-001.8 | System SHALL allow regeneration with different parameters |
| FR-GEN-001.9 | System SHALL allow inline editing of generated content |
| FR-GEN-001.10 | System SHALL limit free users to 2 generations per month |

#### 3.5.2 Resume Optimization
**ID:** FR-GEN-002  
**Priority:** P1 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-GEN-002.1 | System SHALL rewrite resume sections for specific job |
| FR-GEN-002.2 | System SHALL optimize keywords for ATS compatibility |
| FR-GEN-002.3 | System SHALL improve action verb usage |
| FR-GEN-002.4 | System SHALL quantify achievements where possible |
| FR-GEN-002.5 | System SHALL maintain truthfulness (no fabrication) |
| FR-GEN-002.6 | System SHALL preserve user's voice and style |
| FR-GEN-002.7 | System SHALL show before/after comparison |
| FR-GEN-002.8 | System SHALL allow accepting/rejecting individual changes |

#### 3.5.3 Skill Gap Analysis
**ID:** FR-GEN-003  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-GEN-003.1 | System SHALL identify skills required by job but missing from resume |
| FR-GEN-003.2 | System SHALL categorize gaps (technical, soft, domain) |
| FR-GEN-003.3 | System SHALL assess gap severity (critical, important, nice-to-have) |
| FR-GEN-003.4 | System SHALL suggest ways to acquire missing skills |
| FR-GEN-003.5 | System SHALL recommend learning resources |
| FR-GEN-003.6 | System SHALL estimate time to close each gap |

---

### 3.6 Mock Interviews

#### 3.6.1 Interview Session Management
**ID:** FR-INT-001  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-INT-001.1 | System SHALL support HR/Behavioral interview type |
| FR-INT-001.2 | System SHALL support Technical interview type |
| FR-INT-001.3 | System SHALL support System Design interview type |
| FR-INT-001.4 | System SHALL support Case Study interview type |
| FR-INT-001.5 | System SHALL allow selecting interview difficulty |
| FR-INT-001.6 | System SHALL allow selecting interview duration |
| FR-INT-001.7 | System SHALL customize questions based on job and resume |
| FR-INT-001.8 | System SHALL limit free users to 0 sessions |
| FR-INT-001.9 | System SHALL limit Pro users to 10 sessions per month |

#### 3.6.2 Interview Interaction
**ID:** FR-INT-002  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-INT-002.1 | System SHALL present questions via text interface |
| FR-INT-002.2 | System SHALL accept text responses |
| FR-INT-002.3 | System SHALL generate contextual follow-up questions |
| FR-INT-002.4 | System SHALL maintain conversation context |
| FR-INT-002.5 | System SHALL allow pausing and resuming sessions |
| FR-INT-002.6 | System SHALL allow ending session early |
| FR-INT-002.7 | System SHOULD support voice input (future) |
| FR-INT-002.8 | System SHOULD support video recording (future) |

#### 3.6.3 Interview Feedback
**ID:** FR-INT-003  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-INT-003.1 | System SHALL generate comprehensive feedback report |
| FR-INT-003.2 | System SHALL score responses on relevance |
| FR-INT-003.3 | System SHALL score responses on clarity |
| FR-INT-003.4 | System SHALL score responses on structure (STAR method) |
| FR-INT-003.5 | System SHALL identify strengths in responses |
| FR-INT-003.6 | System SHALL identify areas for improvement |
| FR-INT-003.7 | System SHALL provide example better responses |
| FR-INT-003.8 | System SHALL track progress across sessions |

---

### 3.7 Job Application Tracker

#### 3.7.1 Pipeline Management
**ID:** FR-TRK-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-TRK-001.1 | System SHALL display jobs in Kanban-style board |
| FR-TRK-001.2 | System SHALL support drag-and-drop between stages |
| FR-TRK-001.3 | System SHALL support default pipeline stages |
| FR-TRK-001.4 | System SHALL allow custom pipeline stages (Premium) |
| FR-TRK-001.5 | System SHALL auto-timestamp stage transitions |
| FR-TRK-001.6 | System SHALL support list view alternative |
| FR-TRK-001.7 | System SHALL support filtering by stage, company, date |
| FR-TRK-001.8 | System SHALL support sorting by various fields |
| FR-TRK-001.9 | System SHALL limit free users to 20 tracked jobs |

**Default Pipeline Stages:**
1. Saved
2. Applied
3. Assessment
4. Recruiter Screen
5. Technical Interview
6. Hiring Manager
7. Final Round
8. Offer
9. Accepted
10. Rejected
11. Withdrawn

#### 3.7.2 Job Details Management
**ID:** FR-TRK-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-TRK-002.1 | System SHALL display job details in side panel |
| FR-TRK-002.2 | System SHALL allow editing job information |
| FR-TRK-002.3 | System SHALL allow adding notes to jobs |
| FR-TRK-002.4 | System SHALL allow attaching documents to jobs |
| FR-TRK-002.5 | System SHALL display ATS score for job |
| FR-TRK-002.6 | System SHALL link to original job posting |
| FR-TRK-002.7 | System SHALL show application timeline |
| FR-TRK-002.8 | System SHALL show associated resume version |

#### 3.7.3 Reminders & Scheduling
**ID:** FR-TRK-003  
**Priority:** P1

| Requirement | Description |
|-------------|-------------|
| FR-TRK-003.1 | System SHALL allow setting follow-up reminders |
| FR-TRK-003.2 | System SHALL allow setting interview dates |
| FR-TRK-003.3 | System SHALL send email reminders |
| FR-TRK-003.4 | System SHALL send in-app notifications |
| FR-TRK-003.5 | System SHALL integrate with Google Calendar |
| FR-TRK-003.6 | System SHALL suggest follow-up timing |

#### 3.7.4 Application Analytics
**ID:** FR-TRK-004  
**Priority:** P2

| Requirement | Description |
|-------------|-------------|
| FR-TRK-004.1 | System SHALL display total applications count |
| FR-TRK-004.2 | System SHALL display conversion rates between stages |
| FR-TRK-004.3 | System SHALL display average time in each stage |
| FR-TRK-004.4 | System SHALL display response rate |
| FR-TRK-004.5 | System SHALL display applications over time chart |
| FR-TRK-004.6 | System SHALL compare performance to benchmarks |

---

### 3.8 Chrome Extension

#### 3.8.1 Extension Core
**ID:** FR-EXT-001  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-EXT-001.1 | Extension SHALL comply with Manifest V3 |
| FR-EXT-001.2 | Extension SHALL request minimal permissions |
| FR-EXT-001.3 | Extension SHALL authenticate with main application |
| FR-EXT-001.4 | Extension SHALL sync state with web application |
| FR-EXT-001.5 | Extension SHALL work offline for basic features |
| FR-EXT-001.6 | Extension SHALL be under 5MB package size |
| FR-EXT-001.7 | Extension SHALL support automatic updates |

#### 3.8.2 Extension Popup
**ID:** FR-EXT-002  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-EXT-002.1 | Popup SHALL display detected job information |
| FR-EXT-002.2 | Popup SHALL display quick match score |
| FR-EXT-002.3 | Popup SHALL display missing skills summary |
| FR-EXT-002.4 | Popup SHALL provide "Analyze" action button |
| FR-EXT-002.5 | Popup SHALL provide "Save Job" action button |
| FR-EXT-002.6 | Popup SHALL provide link to full analysis |
| FR-EXT-002.7 | Popup SHALL display user's login status |
| FR-EXT-002.8 | Popup SHALL load within 500ms |

#### 3.8.3 Extension Communication
**ID:** FR-EXT-003  
**Priority:** P0 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-EXT-003.1 | Extension SHALL communicate via secure HTTPS |
| FR-EXT-003.2 | Extension SHALL include auth token in requests |
| FR-EXT-003.3 | Extension SHALL handle API errors gracefully |
| FR-EXT-003.4 | Extension SHALL queue requests when offline |
| FR-EXT-003.5 | Extension SHALL sync queued requests when online |

---

### 3.9 Company Research

#### 3.9.1 Company Intelligence
**ID:** FR-CMP-001  
**Priority:** P2

| Requirement | Description |
|-------------|-------------|
| FR-CMP-001.1 | System SHALL provide company overview |
| FR-CMP-001.2 | System SHALL aggregate company reviews |
| FR-CMP-001.3 | System SHALL display company size and industry |
| FR-CMP-001.4 | System SHALL display funding/financial information |
| FR-CMP-001.5 | System SHALL display tech stack (for tech companies) |
| FR-CMP-001.6 | System SHALL analyze interview process |
| FR-CMP-001.7 | System SHALL provide typical interview questions |
| FR-CMP-001.8 | System SHALL estimate salary ranges |

---

### 3.10 Dashboard & Analytics

#### 3.10.1 User Dashboard
**ID:** FR-DASH-001  
**Priority:** P1 [MVP]

| Requirement | Description |
|-------------|-------------|
| FR-DASH-001.1 | System SHALL display recent activity |
| FR-DASH-001.2 | System SHALL display application statistics |
| FR-DASH-001.3 | System SHALL display upcoming interviews/reminders |
| FR-DASH-001.4 | System SHALL display quick actions |
| FR-DASH-001.5 | System SHALL display AI usage metrics |
| FR-DASH-001.6 | System SHALL display skill progress |
| FR-DASH-001.7 | System SHALL be customizable (Premium) |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements

| Requirement | Description |
|-------------|-------------|
| UI-001 | Interface SHALL be responsive (mobile, tablet, desktop) |
| UI-002 | Interface SHALL support dark and light themes |
| UI-003 | Interface SHALL follow WCAG 2.1 AA accessibility |
| UI-004 | Interface SHALL provide loading states for async operations |
| UI-005 | Interface SHALL provide error states with recovery actions |
| UI-006 | Interface SHALL provide empty states with guidance |
| UI-007 | Interface SHALL use consistent design language |
| UI-008 | Interface SHALL support keyboard navigation |
| UI-009 | Interface SHALL provide toast notifications |
| UI-010 | Interface SHALL support internationalization (future) |

#### 4.1.2 Landing Page

| Component | Requirements |
|-----------|--------------|
| Hero Section | Animated background, tagline, CTA, demo preview |
| Features Section | AI workflow illustration, feature cards with icons |
| Extension Showcase | Browser mockup, feature highlights |
| Testimonials | Carousel, avatars, quotes, company logos |
| Pricing | Tier comparison, feature matrix, CTA buttons |
| FAQ | Accordion, searchable |
| Footer | Links, social, newsletter signup |

#### 4.1.3 Application Screens

| Screen | Key Components |
|--------|----------------|
| Dashboard | Stats cards, activity feed, quick actions, charts |
| Resume Manager | Upload zone, version list, detail panel |
| Job Tracker | Kanban board, filters, detail sidebar |
| Job Analysis | Score gauge, breakdown charts, suggestions list |
| Cover Letter | Editor, tone selector, regenerate button |
| Mock Interview | Chat interface, timer, end session button |
| Settings | Tabs, form sections, save button |

### 4.2 Hardware Interfaces

Not applicable - this is a web-based application.

### 4.3 Software Interfaces

#### 4.3.1 External APIs

| System | Interface Type | Purpose |
|--------|---------------|---------|
| OpenAI | REST API | LLM inference, embeddings |
| Clerk | REST API / SDK | Authentication |
| MongoDB Atlas | Driver | Database operations |
| Redis Cloud | Driver | Caching, queues |
| Qdrant Cloud | REST API | Vector storage/search |
| AWS S3 | SDK | File storage |
| SendGrid | REST API | Email delivery |
| Stripe | REST API | Payment processing |

#### 4.3.2 Internal APIs

| API | Protocol | Format |
|-----|----------|--------|
| Web Application API | REST | JSON |
| Extension API | REST | JSON |
| WebSocket Events | WebSocket | JSON |

### 4.4 Communication Interfaces

| Interface | Protocol | Security |
|-----------|----------|----------|
| Client-Server | HTTPS (TLS 1.3) | JWT tokens |
| Server-Database | MongoDB Wire | TLS + Auth |
| Server-Cache | Redis Protocol | TLS + Auth |
| Server-AI | HTTPS | API Key |
| WebSocket | WSS | JWT tokens |
| Email | SMTP | TLS |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-PERF-001 | Page load time | < 2 seconds | Lighthouse |
| NFR-PERF-002 | Time to interactive | < 3 seconds | Lighthouse |
| NFR-PERF-003 | API response time (p50) | < 100ms | APM |
| NFR-PERF-004 | API response time (p95) | < 200ms | APM |
| NFR-PERF-005 | API response time (p99) | < 500ms | APM |
| NFR-PERF-006 | AI generation time | < 15 seconds | Custom metrics |
| NFR-PERF-007 | Extension popup load | < 500ms | Custom metrics |
| NFR-PERF-008 | Resume parsing time | < 5 seconds | Custom metrics |
| NFR-PERF-009 | Database query time | < 50ms | APM |
| NFR-PERF-010 | Concurrent users | 10,000 | Load testing |

### 5.2 Safety Requirements

| ID | Requirement |
|----|-------------|
| NFR-SAFE-001 | System SHALL implement graceful degradation |
| NFR-SAFE-002 | System SHALL provide fallback for AI failures |
| NFR-SAFE-003 | System SHALL queue operations during outages |
| NFR-SAFE-004 | System SHALL maintain data integrity during failures |
| NFR-SAFE-005 | System SHALL log all errors with context |

### 5.3 Security Requirements

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR-SEC-001 | Encrypt data at rest | AES-256 |
| NFR-SEC-002 | Encrypt data in transit | TLS 1.3 |
| NFR-SEC-003 | Implement authentication | Clerk + JWT |
| NFR-SEC-004 | Implement authorization | RBAC |
| NFR-SEC-005 | Prevent SQL/NoSQL injection | Input validation, parameterized queries |
| NFR-SEC-006 | Prevent XSS | Output encoding, CSP |
| NFR-SEC-007 | Prevent CSRF | CSRF tokens |
| NFR-SEC-008 | Implement rate limiting | Redis-based |
| NFR-SEC-009 | Secure file uploads | Type validation, virus scan |
| NFR-SEC-010 | Implement audit logging | All sensitive operations |
| NFR-SEC-011 | Secure API keys | Vault/Secret Manager |
| NFR-SEC-012 | Implement MFA | Optional for users |
| NFR-SEC-013 | Prevent prompt injection | Input sanitization, output validation |

### 5.4 Software Quality Attributes

#### 5.4.1 Availability
| Requirement | Target |
|-------------|--------|
| Uptime | 99.9% (8.76 hours downtime/year) |
| Planned maintenance | < 4 hours/month |
| Mean time to recovery | < 1 hour |

#### 5.4.2 Scalability
| Requirement | Target |
|-------------|--------|
| Horizontal scaling | Auto-scale based on load |
| Database scaling | Sharding ready |
| CDN | Global edge caching |

#### 5.4.3 Maintainability
| Requirement | Implementation |
|-------------|----------------|
| Code coverage | > 80% |
| Documentation | Inline + external |
| Logging | Structured JSON |
| Monitoring | APM + custom dashboards |

#### 5.4.4 Portability
| Requirement | Implementation |
|-------------|----------------|
| Containerization | Docker |
| Orchestration | Kubernetes |
| Cloud agnostic | Terraform |

### 5.5 Business Rules

| ID | Rule |
|----|------|
| BR-001 | Free users limited to 3 resume uploads |
| BR-002 | Free users limited to 5 job analyses per month |
| BR-003 | Free users limited to 2 cover letters per month |
| BR-004 | Free users limited to 20 tracked jobs |
| BR-005 | Free users have no access to mock interviews |
| BR-006 | Pro users limited to 10 mock interviews per month |
| BR-007 | Premium users have unlimited access to all features |
| BR-008 | Subscription billing on monthly or annual cycle |
| BR-009 | 14-day free trial for Pro tier |
| BR-010 | Data retention: 30 days after account deletion |

---

## 6. User Stories & Acceptance Criteria

### 6.1 Epic: User Authentication

#### US-AUTH-001: User Registration
**As a** job seeker  
**I want to** create an account  
**So that** I can access the platform's features

**Acceptance Criteria:**
```gherkin
Scenario: Successful email registration
  Given I am on the registration page
  When I enter a valid email "user@example.com"
  And I enter a valid password "SecurePass123!"
  And I confirm the password
  And I click "Create Account"
  Then I should see a verification email message
  And I should receive a verification email
  And my account should be created with "Free" tier

Scenario: Registration with existing email
  Given I am on the registration page
  And "user@example.com" is already registered
  When I enter email "user@example.com"
  And I complete the registration form
  Then I should see error "Email already registered"
  And no duplicate account should be created

Scenario: Registration with weak password
  Given I am on the registration page
  When I enter password "weak"
  Then I should see password requirement indicators
  And the "Create Account" button should be disabled
```

#### US-AUTH-002: Google OAuth Login
**As a** user  
**I want to** sign in with Google  
**So that** I can access the platform without creating a new password

**Acceptance Criteria:**
```gherkin
Scenario: Successful Google login
  Given I am on the login page
  When I click "Continue with Google"
  And I complete Google OAuth flow
  Then I should be logged in
  And I should be redirected to the dashboard
  And my profile should show my Google profile picture

Scenario: Google login for new user
  Given I am on the login page
  And I don't have an existing account
  When I complete Google OAuth flow
  Then a new account should be created
  And I should be redirected to onboarding
```

### 6.2 Epic: Resume Management

#### US-RES-001: Upload Resume
**As a** job seeker  
**I want to** upload my resume  
**So that** the platform can analyze it

**Acceptance Criteria:**
```gherkin
Scenario: Upload PDF resume
  Given I am logged in
  And I am on the resume page
  When I drag a PDF file into the upload zone
  Then I should see upload progress
  And my resume should be parsed
  And I should see extracted information
  And the resume should appear in my list

Scenario: Upload too large file
  Given I am logged in
  When I try to upload a 15MB file
  Then I should see error "File size exceeds 10MB limit"
  And the file should not be uploaded

Scenario: Free user at limit
  Given I am a free user
  And I have 3 resumes uploaded
  When I try to upload another resume
  Then I should see upgrade prompt
  And the file should not be uploaded
```

#### US-RES-002: View Parsed Resume
**As a** job seeker  
**I want to** view my parsed resume data  
**So that** I can verify accuracy and make corrections

**Acceptance Criteria:**
```gherkin
Scenario: View parsed data
  Given I have uploaded a resume
  When I click on the resume
  Then I should see contact information section
  And I should see experience section
  And I should see education section
  And I should see skills section
  And each section should be editable

Scenario: Edit parsed data
  Given I am viewing my parsed resume
  When I edit my job title
  And I click "Save"
  Then the change should be saved
  And I should see a success notification
```

### 6.3 Epic: Job Analysis

#### US-JOB-001: Analyze Job via Extension
**As a** job seeker  
**I want to** analyze a job posting with one click  
**So that** I can quickly assess my fit

**Acceptance Criteria:**
```gherkin
Scenario: Analyze LinkedIn job
  Given I have the extension installed
  And I am logged in
  And I am viewing a job on LinkedIn
  When I click the extension icon
  Then I should see the job title and company
  And I should see my match score
  And I should see missing skills
  And I should see "View Full Analysis" button

Scenario: Save job from extension
  Given I am viewing extension popup with job
  When I click "Save Job"
  Then the job should be saved to my tracker
  And I should see confirmation
  And the "Save" button should change to "Saved"
```

#### US-JOB-002: View ATS Score
**As a** job seeker  
**I want to** see my ATS compatibility score  
**So that** I can understand my chances

**Acceptance Criteria:**
```gherkin
Scenario: View ATS score breakdown
  Given I have analyzed a job
  When I view the full analysis
  Then I should see overall score (0-100)
  And I should see keyword match score
  And I should see experience alignment score
  And I should see skills relevance score
  And I should see score visualization

Scenario: View improvement suggestions
  Given I am viewing ATS analysis
  When I scroll to suggestions section
  Then I should see prioritized suggestions
  And each suggestion should show estimated impact
  And I should be able to apply suggestions
```

### 6.4 Epic: Cover Letter Generation

#### US-GEN-001: Generate Cover Letter
**As a** job seeker  
**I want to** generate a tailored cover letter  
**So that** I can apply with a compelling introduction

**Acceptance Criteria:**
```gherkin
Scenario: Generate basic cover letter
  Given I have a resume and job saved
  When I click "Generate Cover Letter"
  And I select tone "Professional"
  And I select length "Medium"
  And I click "Generate"
  Then I should see a loading indicator
  And within 15 seconds I should see generated letter
  And the letter should reference the company name
  And the letter should highlight relevant skills

Scenario: Regenerate with different options
  Given I have a generated cover letter
  When I change tone to "Enthusiastic"
  And I click "Regenerate"
  Then I should see a new version
  And the tone should be noticeably different
```

### 6.5 Epic: Job Tracker

#### US-TRK-001: Track Application
**As a** job seeker  
**I want to** track my job applications  
**So that** I can manage my job search

**Acceptance Criteria:**
```gherkin
Scenario: Move job through pipeline
  Given I have a saved job
  When I drag it from "Saved" to "Applied"
  Then the job should move to "Applied" column
  And the status should update
  And the timestamp should be recorded

Scenario: Add interview note
  Given I am viewing a tracked job
  When I click "Add Note"
  And I enter "Spoke with recruiter, moving to technical"
  And I click "Save"
  Then the note should appear in job timeline
  And it should show timestamp and author
```

### 6.6 Epic: Mock Interviews

#### US-INT-001: Conduct Mock Interview
**As a** job seeker  
**I want to** practice with AI mock interviews  
**So that** I can improve my interview skills

**Acceptance Criteria:**
```gherkin
Scenario: Start behavioral interview
  Given I am a Pro user
  And I have a job saved
  When I click "Start Mock Interview"
  And I select "Behavioral"
  And I select difficulty "Medium"
  And I click "Begin"
  Then I should enter interview mode
  And I should see first question
  And I should see timer

Scenario: Answer and receive follow-up
  Given I am in a mock interview
  When I type my answer
  And I click "Submit"
  Then I should see AI processing indicator
  And I should receive either follow-up question or next topic
  And my answer should be recorded
```

---

## 7. Use Cases

### 7.1 Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AI Job Search Copilot                            │
│                               Use Case Diagram                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐                                                               │
│   │  User   │                                                               │
│   │(Job     │                                                               │
│   │Seeker)  │                                                               │
│   └────┬────┘                                                               │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                   Authentication                        │    │
│        ├───►│  ○ Register Account                                     │    │
│        ├───►│  ○ Login (Email/OAuth)                                  │    │
│        ├───►│  ○ Reset Password                                       │    │
│        ├───►│  ○ Manage Profile                                       │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                  Resume Management                      │    │
│        ├───►│  ○ Upload Resume                                        │    │
│        ├───►│  ○ View Parsed Resume                                   │    │
│        ├───►│  ○ Edit Resume Data                                     │    │
│        ├───►│  ○ Compare Resume Versions                              │    │
│        ├───►│  ○ Export Resume                                        │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                   Job Analysis                          │    │
│        ├───►│  ○ Analyze Job (Extension)         ◄─────────────────┐  │    │
│        ├───►│  ○ Analyze Job (Manual)                              │  │    │
│        ├───►│  ○ View ATS Score                  ◄── includes ─────┤  │    │
│        ├───►│  ○ View Improvement Suggestions    ◄── includes ─────┘  │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                  AI Generation                          │    │
│        ├───►│  ○ Generate Cover Letter                                │    │
│        ├───►│  ○ Optimize Resume                                      │    │
│        ├───►│  ○ Analyze Skill Gaps                                   │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                  Job Tracking                           │    │
│        ├───►│  ○ Save Job                                             │    │
│        ├───►│  ○ Update Application Status                            │    │
│        ├───►│  ○ Add Notes                                            │    │
│        ├───►│  ○ Set Reminders                                        │    │
│        ├───►│  ○ View Analytics                                       │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                 Mock Interviews                         │    │
│        ├───►│  ○ Start Interview Session                              │    │
│        ├───►│  ○ Answer Questions                                     │    │
│        ├───►│  ○ Receive Feedback                                     │    │
│        ├───►│  ○ Review Past Sessions                                 │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│        │                                                                    │
│   ┌────┴────┐                                                               │
│   │  Admin  │                                                               │
│   └────┬────┘                                                               │
│        │    ┌─────────────────────────────────────────────────────────┐    │
│        │    │                  Administration                         │    │
│        ├───►│  ○ Manage Users                                         │    │
│        ├───►│  ○ View Analytics                                       │    │
│        ├───►│  ○ Manage Subscriptions                                 │    │
│        ├───►│  ○ System Configuration                                 │    │
│        │    └─────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Detailed Use Cases

#### UC-001: Analyze Job from Extension

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-001 |
| **Name** | Analyze Job from Extension |
| **Actor** | Job Seeker |
| **Preconditions** | 1. User has extension installed<br>2. User is logged in<br>3. User has uploaded at least one resume<br>4. User is on supported job site |
| **Trigger** | User clicks extension icon on job page |
| **Main Flow** | 1. Extension detects job posting<br>2. Extension extracts job data<br>3. Extension displays popup with job info<br>4. User clicks "Analyze"<br>5. System sends job + resume to API<br>6. System calculates ATS score<br>7. System identifies skill gaps<br>8. System generates suggestions<br>9. Extension displays results |
| **Alternative Flows** | A1: Job not detected → Show manual entry option<br>A2: User not logged in → Show login prompt<br>A3: No resume uploaded → Show upload prompt |
| **Postconditions** | Job analysis displayed in extension |
| **Business Rules** | Free users limited to 5 analyses/month |

#### UC-002: Generate Cover Letter

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-002 |
| **Name** | Generate Cover Letter |
| **Actor** | Job Seeker |
| **Preconditions** | 1. User is logged in<br>2. User has uploaded a resume<br>3. User has analyzed a job |
| **Trigger** | User clicks "Generate Cover Letter" |
| **Main Flow** | 1. System displays generation options<br>2. User selects tone (Professional/Enthusiastic/Conversational)<br>3. User selects length (Short/Medium/Long)<br>4. User optionally adds focus areas<br>5. User clicks "Generate"<br>6. System retrieves resume data<br>7. System retrieves job data<br>8. System calls AI generation service<br>9. System displays generated cover letter<br>10. User can edit, regenerate, or save |
| **Alternative Flows** | A1: Generation fails → Show error and retry option<br>A2: User at limit → Show upgrade prompt |
| **Postconditions** | Cover letter generated and available |
| **Business Rules** | Free users: 2/month, Pro/Premium: unlimited |

#### UC-003: Conduct Mock Interview

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-003 |
| **Name** | Conduct Mock Interview |
| **Actor** | Job Seeker (Pro/Premium) |
| **Preconditions** | 1. User is logged in<br>2. User has Pro or Premium subscription<br>3. User has uploaded a resume<br>4. User has saved a job |
| **Trigger** | User clicks "Start Mock Interview" |
| **Main Flow** | 1. System displays interview options<br>2. User selects interview type<br>3. User selects difficulty<br>4. User selects duration<br>5. User clicks "Begin"<br>6. System generates first question<br>7. User submits answer<br>8. System analyzes answer<br>9. System generates follow-up or next question<br>10. Repeat 7-9 until time ends or user ends<br>11. System generates feedback report<br>12. System displays comprehensive feedback |
| **Alternative Flows** | A1: User pauses → Save state, resume later<br>A2: User ends early → Generate partial feedback |
| **Postconditions** | Interview recorded, feedback generated |
| **Business Rules** | Pro: 10/month, Premium: unlimited |

---

## 8. Data Requirements

### 8.1 Data Dictionary

#### 8.1.1 User Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| email | String | UNIQUE, NOT NULL | User email address |
| passwordHash | String | NULL (for OAuth) | Hashed password |
| firstName | String | NOT NULL | User's first name |
| lastName | String | NOT NULL | User's last name |
| profileImageUrl | String | NULL | Profile photo URL |
| authProvider | Enum | NOT NULL | 'email', 'google', 'github' |
| authProviderId | String | NULL | External auth ID |
| tier | Enum | NOT NULL, DEFAULT 'free' | 'free', 'pro', 'premium' |
| emailVerified | Boolean | DEFAULT false | Email verification status |
| mfaEnabled | Boolean | DEFAULT false | MFA status |
| createdAt | DateTime | NOT NULL | Account creation time |
| updatedAt | DateTime | NOT NULL | Last update time |
| lastLoginAt | DateTime | NULL | Last login time |
| deletedAt | DateTime | NULL | Soft delete timestamp |

#### 8.1.2 Resume Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| userId | UUID | FK, NOT NULL | Owner user ID |
| name | String | NOT NULL | Resume name/label |
| originalFileName | String | NOT NULL | Uploaded file name |
| originalFileUrl | String | NOT NULL | S3 URL |
| parsedData | JSON | NOT NULL | Structured resume data |
| embeddingId | String | NULL | Qdrant vector ID |
| isPrimary | Boolean | DEFAULT false | Primary resume flag |
| version | Integer | NOT NULL, DEFAULT 1 | Version number |
| parentId | UUID | FK, NULL | Parent resume (for versions) |
| createdAt | DateTime | NOT NULL | Creation time |
| updatedAt | DateTime | NOT NULL | Last update time |
| deletedAt | DateTime | NULL | Soft delete timestamp |

#### 8.1.3 Job Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| userId | UUID | FK, NOT NULL | Owner user ID |
| title | String | NOT NULL | Job title |
| company | String | NOT NULL | Company name |
| location | String | NULL | Job location |
| jobType | Enum | NULL | 'full-time', 'part-time', 'contract' |
| salaryMin | Integer | NULL | Minimum salary |
| salaryMax | Integer | NULL | Maximum salary |
| salaryCurrency | String | DEFAULT 'USD' | Salary currency |
| description | Text | NOT NULL | Full job description |
| requirements | JSON | NULL | Parsed requirements |
| responsibilities | JSON | NULL | Parsed responsibilities |
| skills | JSON | NULL | Required/preferred skills |
| sourceUrl | String | NULL | Original posting URL |
| sourcePlatform | String | NULL | 'linkedin', 'indeed', etc. |
| postedDate | DateTime | NULL | Job posting date |
| createdAt | DateTime | NOT NULL | Creation time |
| updatedAt | DateTime | NOT NULL | Last update time |

#### 8.1.4 Application Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| userId | UUID | FK, NOT NULL | Owner user ID |
| jobId | UUID | FK, NOT NULL | Associated job |
| resumeId | UUID | FK, NULL | Resume used |
| status | Enum | NOT NULL | Pipeline stage |
| atsScore | Integer | NULL | ATS match score (0-100) |
| atsAnalysis | JSON | NULL | Detailed ATS analysis |
| coverLetter | Text | NULL | Generated/saved cover letter |
| notes | JSON | DEFAULT [] | Application notes |
| reminders | JSON | DEFAULT [] | Scheduled reminders |
| appliedAt | DateTime | NULL | Application submission time |
| createdAt | DateTime | NOT NULL | Creation time |
| updatedAt | DateTime | NOT NULL | Last update time |

#### 8.1.5 Interview Session Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | Unique identifier |
| userId | UUID | FK, NOT NULL | User ID |
| jobId | UUID | FK, NULL | Associated job |
| type | Enum | NOT NULL | Interview type |
| difficulty | Enum | NOT NULL | 'easy', 'medium', 'hard' |
| status | Enum | NOT NULL | 'in_progress', 'completed', 'abandoned' |
| messages | JSON | NOT NULL | Conversation history |
| feedback | JSON | NULL | Generated feedback |
| score | Integer | NULL | Overall score (0-100) |
| duration | Integer | NULL | Session duration (seconds) |
| startedAt | DateTime | NOT NULL | Session start time |
| completedAt | DateTime | NULL | Session end time |

### 8.2 Data Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Entity Relationship Diagram                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐         ┌──────────┐         ┌──────────┐                   │
│   │   User   │ 1     n │  Resume  │         │Embedding │                   │
│   │──────────│─────────│──────────│ 1─────1 │──────────│                   │
│   │ id (PK)  │         │ id (PK)  │         │ id (PK)  │                   │
│   │ email    │         │ userId   │         │ resumeId │                   │
│   │ tier     │         │ parsedDat│         │ vector   │                   │
│   └──────────┘         └──────────┘         └──────────┘                   │
│        │                    │                                               │
│        │ 1                  │                                               │
│        │                    │ n                                             │
│        │ n                  │                                               │
│   ┌────┴─────┐         ┌────┴─────┐                                        │
│   │   Job    │ 1     1 │Application│                                        │
│   │──────────│─────────│──────────│                                        │
│   │ id (PK)  │         │ id (PK)  │                                        │
│   │ userId   │         │ userId   │                                        │
│   │ title    │         │ jobId    │                                        │
│   │ company  │         │ resumeId │                                        │
│   └──────────┘         │ status   │                                        │
│        │               │ atsScore │                                        │
│        │               └──────────┘                                        │
│        │ 1                  │                                               │
│        │                    │                                               │
│        │ n                  │                                               │
│   ┌────┴─────┐              │ n                                            │
│   │Interview │              │                                               │
│   │ Session  │◄─────────────┘                                              │
│   │──────────│                                                              │
│   │ id (PK)  │                                                              │
│   │ userId   │                                                              │
│   │ jobId    │                                                              │
│   │ type     │                                                              │
│   │ messages │                                                              │
│   │ feedback │                                                              │
│   └──────────┘                                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Data Retention

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| User accounts | Until deletion + 30 days | Soft delete with recovery period |
| Resumes | Until deletion + 30 days | Soft delete with recovery period |
| Jobs | Until deletion | Permanent delete |
| Applications | Until deletion | Permanent delete |
| Interview sessions | 1 year | Auto-archive after 1 year |
| Audit logs | 2 years | Compliance requirement |
| Analytics | 2 years | Aggregated after 90 days |

---

## 9. Appendices

### 9.1 Appendix A: Wireframe Specifications

Detailed wireframes will be provided in a separate document: `WIREFRAMES.md`

Key screens to design:
1. Landing Page
2. Registration/Login
3. Dashboard
4. Resume Manager
5. Job Tracker (Kanban)
6. Job Analysis
7. Cover Letter Generator
8. Mock Interview
9. Settings
10. Extension Popup

### 9.2 Appendix B: API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/login` | POST | User login |
| `/api/v1/auth/logout` | POST | User logout |
| `/api/v1/auth/refresh` | POST | Refresh token |
| `/api/v1/users/me` | GET | Get current user |
| `/api/v1/users/me` | PATCH | Update current user |
| `/api/v1/resumes` | GET | List user resumes |
| `/api/v1/resumes` | POST | Upload resume |
| `/api/v1/resumes/:id` | GET | Get resume |
| `/api/v1/resumes/:id` | PATCH | Update resume |
| `/api/v1/resumes/:id` | DELETE | Delete resume |
| `/api/v1/jobs` | GET | List user jobs |
| `/api/v1/jobs` | POST | Create job |
| `/api/v1/jobs/:id` | GET | Get job |
| `/api/v1/jobs/:id/analyze` | POST | Analyze job |
| `/api/v1/applications` | GET | List applications |
| `/api/v1/applications/:id` | PATCH | Update application |
| `/api/v1/generate/cover-letter` | POST | Generate cover letter |
| `/api/v1/generate/resume-optimize` | POST | Optimize resume |
| `/api/v1/interviews` | POST | Start interview |
| `/api/v1/interviews/:id/message` | POST | Send message |
| `/api/v1/interviews/:id/end` | POST | End interview |

Full API documentation in: `docs/api/README.md`

### 9.3 Appendix C: Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid credentials |
| AUTH_002 | 401 | Token expired |
| AUTH_003 | 403 | Insufficient permissions |
| AUTH_004 | 403 | Account locked |
| AUTH_005 | 400 | Email not verified |
| VAL_001 | 400 | Validation error |
| VAL_002 | 400 | Invalid file type |
| VAL_003 | 400 | File too large |
| RES_001 | 404 | Resource not found |
| RES_002 | 409 | Resource conflict |
| LIMIT_001 | 429 | Rate limit exceeded |
| LIMIT_002 | 403 | Feature limit reached |
| AI_001 | 500 | AI service error |
| AI_002 | 504 | AI timeout |
| SYS_001 | 500 | Internal server error |
| SYS_002 | 503 | Service unavailable |

### 9.4 Appendix D: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-07-27 | Engineering Team | Initial draft |

---

*End of Software Requirements Specification*
