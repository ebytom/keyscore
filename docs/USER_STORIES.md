# User Stories & Product Backlog
# AI Job Search Copilot

**Version:** 1.0.0  
**Last Updated:** 2026-07-27  
**Status:** Approved

---

## Table of Contents

1. [Story Map Overview](#1-story-map-overview)
2. [Epic Breakdown](#2-epic-breakdown)
3. [Detailed User Stories](#3-detailed-user-stories)
4. [Product Backlog](#4-product-backlog)
5. [Sprint Planning](#5-sprint-planning)
6. [Story Point Reference](#6-story-point-reference)

---

## 1. Story Map Overview

### 1.1 Story Map Visualization

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        USER STORY MAP - AI JOB SEARCH COPILOT                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                 │
│  USER ACTIVITIES (Left to Right = User Journey)                                                                 │
│                                                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Onboard   │  │   Manage    │  │   Analyze   │  │   Apply     │  │  Interview  │  │   Track     │          │
│  │   & Auth    │  │   Resume    │  │    Jobs     │  │   to Jobs   │  │    Prep     │  │  & Analyze  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                │                │                │                  │
│  ═══════╪════════════════╪════════════════╪════════════════╪════════════════╪════════════════╪═══════ MVP ════  │
│         │                │                │                │                │                │                  │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐          │
│  │ Register    │  │ Upload      │  │ Detect Job  │  │ Generate    │  │             │  │ Save Job    │          │
│  │ account     │  │ resume      │  │ (Extension) │  │ cover letter│  │             │  │ to tracker  │          │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤  │             │  ├─────────────┤          │
│  │ Login with  │  │ View parsed │  │ Extract job │  │ Optimize    │  │             │  │ Update      │          │
│  │ OAuth       │  │ data        │  │ data        │  │ resume      │  │             │  │ status      │          │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤  │             │  ├─────────────┤          │
│  │ Set up      │  │ Edit resume │  │ View ATS    │  │             │  │             │  │ View        │          │
│  │ profile     │  │ data        │  │ score       │  │             │  │             │  │ pipeline    │          │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  │             │  │             │  ├─────────────┤          │
│  │ Dark/Light  │  │ Set primary │  │ View        │  │             │  │             │  │ Add notes   │          │
│  │ theme       │  │ resume      │  │ suggestions │  │             │  │             │  │             │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                                                 │
│  ═══════════════════════════════════════════════════════════════════════════════════════════════ PHASE 2 ════  │
│                                                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ MFA setup   │  │ Version     │  │ Manual job  │  │ Batch       │  │ Mock HR     │  │ Set         │          │
│  │             │  │ comparison  │  │ entry       │  │ generation  │  │ interview   │  │ reminders   │          │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤          │
│  │             │  │ Export      │  │ Skill gap   │  │             │  │ Mock tech   │  │ Analytics   │          │
│  │             │  │ resume      │  │ analysis    │  │             │  │ interview   │  │ dashboard   │          │
│  │             │  ├─────────────┤  ├─────────────┤  │             │  ├─────────────┤  ├─────────────┤          │
│  │             │  │ Custom      │  │ Company     │  │             │  │ Interview   │  │ Calendar    │          │
│  │             │  │ templates   │  │ research    │  │             │  │ feedback    │  │ integration │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                                                 │
│  ═══════════════════════════════════════════════════════════════════════════════════════════════ PHASE 3 ════  │
│                                                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Team        │  │ AI resume   │  │ Salary      │  │ Auto-apply  │  │ Video mock  │  │ Weekly      │          │
│  │ accounts    │  │ builder     │  │ insights    │  │ (Future)    │  │ interviews  │  │ reports     │          │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤  │             │  ├─────────────┤  ├─────────────┤          │
│  │ Enterprise  │  │ Portfolio   │  │ Market      │  │             │  │ Career      │  │ Goal        │          │
│  │ SSO         │  │ integration │  │ trends      │  │             │  │ coaching    │  │ tracking    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Release Planning

| Release | Timeline | Focus | Stories |
|---------|----------|-------|---------|
| **MVP (v1.0)** | Weeks 1-12 | Core value, end-to-end flow | 45 stories |
| **Phase 2 (v1.5)** | Weeks 13-24 | AI depth, interview prep | 35 stories |
| **Phase 3 (v2.0)** | Weeks 25-40 | Scale, enterprise, advanced | 40 stories |

---

## 2. Epic Breakdown

### 2.1 MVP Epics

| Epic ID | Epic Name | Stories | Story Points | Priority |
|---------|-----------|---------|--------------|----------|
| E01 | Authentication & User Management | 12 | 55 | P0 |
| E02 | Resume Management | 10 | 62 | P0 |
| E03 | Chrome Extension | 8 | 45 | P0 |
| E04 | Job Analysis & ATS Scoring | 8 | 48 | P0 |
| E05 | AI Document Generation | 6 | 40 | P0 |
| E06 | Job Tracker | 9 | 42 | P0 |
| E07 | Landing Page & Marketing | 5 | 25 | P0 |
| E08 | Dashboard | 4 | 18 | P1 |
| **MVP Total** | | **62** | **335** | |

### 2.2 Phase 2 Epics

| Epic ID | Epic Name | Stories | Story Points | Priority |
|---------|-----------|---------|--------------|----------|
| E09 | Mock Interviews | 10 | 65 | P1 |
| E10 | Skill Gap Analysis | 6 | 35 | P1 |
| E11 | Company Research | 8 | 48 | P2 |
| E12 | Learning Roadmaps | 6 | 38 | P2 |
| E13 | Advanced Analytics | 5 | 25 | P2 |
| **Phase 2 Total** | | **35** | **211** | |

### 2.3 Phase 3 Epics

| Epic ID | Epic Name | Stories | Story Points | Priority |
|---------|-----------|---------|--------------|----------|
| E14 | Career Coaching AI | 8 | 55 | P2 |
| E15 | Team & Enterprise | 10 | 65 | P3 |
| E16 | Integrations | 8 | 45 | P3 |
| E17 | Mobile PWA | 6 | 40 | P3 |
| E18 | Advanced AI Features | 8 | 50 | P3 |
| **Phase 3 Total** | | **40** | **255** | |

---

## 3. Detailed User Stories

### 3.1 Epic E01: Authentication & User Management

#### US-E01-001: Email Registration
**Priority:** P0 | **Points:** 5 | **Sprint:** 1

**As a** new user  
**I want to** create an account with my email  
**So that** I can access the platform

**Acceptance Criteria:**
- [ ] Registration form with email, password, name fields
- [ ] Email format validation
- [ ] Password strength indicator (min 8 chars, 1 upper, 1 number, 1 special)
- [ ] Password confirmation field
- [ ] Terms of service checkbox (required)
- [ ] Submit button disabled until valid
- [ ] Verification email sent on submit
- [ ] Success message with "check email" instructions
- [ ] Account created with "Free" tier by default
- [ ] Redirect to onboarding after email verification

**Technical Notes:**
- Use Clerk for authentication
- Store user in MongoDB after Clerk webhook
- Email via SendGrid

---

#### US-E01-002: Google OAuth Login
**Priority:** P0 | **Points:** 3 | **Sprint:** 1

**As a** user  
**I want to** sign up/login with Google  
**So that** I can access the platform without creating a password

**Acceptance Criteria:**
- [ ] "Continue with Google" button on login/register pages
- [ ] Redirect to Google OAuth consent screen
- [ ] Handle OAuth callback
- [ ] Create account if new user
- [ ] Login if existing user
- [ ] Fetch profile picture from Google
- [ ] Redirect to dashboard (existing) or onboarding (new)

---

#### US-E01-003: GitHub OAuth Login
**Priority:** P0 | **Points:** 3 | **Sprint:** 1

**As a** developer user  
**I want to** sign up/login with GitHub  
**So that** I can access the platform using my developer identity

**Acceptance Criteria:**
- [ ] "Continue with GitHub" button on login/register pages
- [ ] Redirect to GitHub OAuth consent screen
- [ ] Handle OAuth callback
- [ ] Create account if new user
- [ ] Login if existing user
- [ ] Fetch profile picture from GitHub
- [ ] Redirect to dashboard (existing) or onboarding (new)

---

#### US-E01-004: Password Reset
**Priority:** P0 | **Points:** 3 | **Sprint:** 1

**As a** user who forgot my password  
**I want to** reset my password via email  
**So that** I can regain access to my account

**Acceptance Criteria:**
- [ ] "Forgot password" link on login page
- [ ] Email input form
- [ ] Success message regardless of email existence (security)
- [ ] Reset email with secure, time-limited link (1 hour)
- [ ] Reset page with new password + confirmation
- [ ] Password strength validation
- [ ] Success message and redirect to login
- [ ] Invalidate all existing sessions
- [ ] Notification email that password was changed

---

#### US-E01-005: User Profile View & Edit
**Priority:** P0 | **Points:** 5 | **Sprint:** 2

**As a** logged-in user  
**I want to** view and edit my profile  
**So that** I can keep my information current

**Acceptance Criteria:**
- [ ] Profile page accessible from header menu
- [ ] Display: name, email, profile photo, join date
- [ ] Edit mode for name, profile photo
- [ ] Photo upload (max 5MB, jpg/png)
- [ ] Photo crop/resize interface
- [ ] Save changes with loading state
- [ ] Success toast notification
- [ ] Cancel button to discard changes

---

#### US-E01-006: Email Verification
**Priority:** P0 | **Points:** 3 | **Sprint:** 1

**As a** new user  
**I want to** verify my email address  
**So that** I can confirm my identity and access full features

**Acceptance Criteria:**
- [ ] Verification email with unique link
- [ ] Link expires after 24 hours
- [ ] Clicking link marks email as verified
- [ ] Success page after verification
- [ ] Resend verification option on login if unverified
- [ ] Rate limit resend (1 per minute)
- [ ] Banner in app if email unverified

---

#### US-E01-007: User Logout
**Priority:** P0 | **Points:** 2 | **Sprint:** 1

**As a** logged-in user  
**I want to** log out of my account  
**So that** I can secure my session

**Acceptance Criteria:**
- [ ] Logout option in user menu
- [ ] Confirmation not required (instant logout)
- [ ] Clear session/tokens
- [ ] Redirect to login page
- [ ] Show toast "You have been logged out"

---

#### US-E01-008: Session Management
**Priority:** P0 | **Points:** 5 | **Sprint:** 2

**As a** user  
**I want to** have my session managed securely  
**So that** my account stays protected

**Acceptance Criteria:**
- [ ] JWT access tokens (15 min expiry)
- [ ] Refresh tokens (30 days expiry)
- [ ] Silent refresh when access token expires
- [ ] Session timeout after 24 hours of inactivity
- [ ] "Remember me" option extends to 30 days
- [ ] Token stored in httpOnly cookies
- [ ] CSRF protection on mutations

---

#### US-E01-009: Account Deletion
**Priority:** P1 | **Points:** 5 | **Sprint:** 3

**As a** user  
**I want to** delete my account  
**So that** I can remove my data from the platform

**Acceptance Criteria:**
- [ ] Delete option in account settings
- [ ] Confirmation dialog with warning
- [ ] Require password entry for email users
- [ ] 30-day soft delete period
- [ ] Immediate logout after deletion
- [ ] Confirmation email with recovery link
- [ ] Data anonymization after 30 days
- [ ] Cannot create new account with same email during soft delete

---

#### US-E01-010: Notification Preferences
**Priority:** P1 | **Points:** 3 | **Sprint:** 3

**As a** user  
**I want to** manage my notification preferences  
**So that** I receive only relevant communications

**Acceptance Criteria:**
- [ ] Notification settings page
- [ ] Toggle: Email notifications (on/off)
- [ ] Toggle: Application updates
- [ ] Toggle: Interview reminders
- [ ] Toggle: Weekly digest
- [ ] Toggle: Product updates/tips
- [ ] Save changes immediately
- [ ] Unsubscribe link in emails

---

#### US-E01-011: Theme Selection (Dark/Light)
**Priority:** P0 | **Points:** 3 | **Sprint:** 2

**As a** user  
**I want to** choose between dark and light themes  
**So that** I can use the app comfortably in any lighting

**Acceptance Criteria:**
- [ ] Theme toggle in header or settings
- [ ] Options: Light, Dark, System
- [ ] Smooth transition animation
- [ ] Persist preference in localStorage + database
- [ ] No flash of wrong theme on page load
- [ ] System option follows OS preference
- [ ] All components styled for both themes

---

#### US-E01-012: Account Lockout Protection
**Priority:** P0 | **Points:** 3 | **Sprint:** 2

**As a** user  
**I want to** be protected from brute force attacks  
**So that** my account remains secure

**Acceptance Criteria:**
- [ ] Lock account after 5 failed login attempts
- [ ] Lock duration: 15 minutes
- [ ] Show "account locked" message
- [ ] Email notification when locked
- [ ] Rate limit login attempts by IP
- [ ] CAPTCHA after 3 failed attempts
- [ ] Unlock via email link option

---

### 3.2 Epic E02: Resume Management

#### US-E02-001: Upload Resume (PDF)
**Priority:** P0 | **Points:** 5 | **Sprint:** 2

**As a** user  
**I want to** upload my resume as a PDF  
**So that** the platform can analyze it

**Acceptance Criteria:**
- [ ] Drag-and-drop upload zone
- [ ] Click to browse option
- [ ] Accept PDF files only
- [ ] Max file size: 10MB
- [ ] File type validation (MIME + extension)
- [ ] Upload progress indicator
- [ ] Error messages for invalid files
- [ ] Store file in S3 with unique key
- [ ] Trigger parsing job after upload

---

#### US-E02-002: Upload Resume (DOCX)
**Priority:** P0 | **Points:** 3 | **Sprint:** 2

**As a** user  
**I want to** upload my resume as a Word document  
**So that** I can use my existing format

**Acceptance Criteria:**
- [ ] Accept DOCX files in upload zone
- [ ] Validate DOCX format
- [ ] Convert to text for parsing
- [ ] Store original file in S3
- [ ] Handle formatting gracefully

---

#### US-E02-003: Parse Resume Content
**Priority:** P0 | **Points:** 13 | **Sprint:** 2-3

**As a** user  
**I want to** have my resume automatically parsed  
**So that** I can see structured data

**Acceptance Criteria:**
- [ ] Extract contact info (name, email, phone, LinkedIn, location)
- [ ] Extract professional summary
- [ ] Extract work experience (company, title, dates, bullets)
- [ ] Extract education (school, degree, field, dates, GPA)
- [ ] Extract skills (technical, soft)
- [ ] Extract certifications
- [ ] Extract projects
- [ ] Handle multi-column layouts
- [ ] Parsing completes within 30 seconds
- [ ] Show parsing progress
- [ ] Display parsed results for review

**Technical Notes:**
- Use PDF.js for text extraction
- Use OpenAI for structured parsing
- Store in MongoDB with JSON schema

---

#### US-E02-004: View Parsed Resume
**Priority:** P0 | **Points:** 5 | **Sprint:** 3

**As a** user  
**I want to** view my parsed resume data  
**So that** I can verify the extraction was accurate

**Acceptance Criteria:**
- [ ] Display all sections in organized layout
- [ ] Contact info card at top
- [ ] Experience timeline view
- [ ] Education section
- [ ] Skills as tags/chips
- [ ] Projects section
- [ ] Certifications list
- [ ] "Edit" button for each section
- [ ] "View Original" link to PDF

---

#### US-E02-005: Edit Parsed Resume Data
**Priority:** P0 | **Points:** 5 | **Sprint:** 3

**As a** user  
**I want to** edit the parsed resume data  
**So that** I can correct any parsing errors

**Acceptance Criteria:**
- [ ] Inline editing for all fields
- [ ] Add/remove experience entries
- [ ] Add/remove education entries
- [ ] Add/remove skills
- [ ] Date picker for dates
- [ ] Rich text for descriptions
- [ ] Auto-save or explicit save
- [ ] Undo capability
- [ ] Validation for required fields

---

#### US-E02-006: Manage Multiple Resumes
**Priority:** P0 | **Points:** 5 | **Sprint:** 3

**As a** user  
**I want to** manage multiple resume versions  
**So that** I can use different resumes for different applications

**Acceptance Criteria:**
- [ ] Resume list view with cards
- [ ] Display: name, upload date, thumbnail preview
- [ ] Rename resume option
- [ ] Delete resume (soft delete)
- [ ] Set as "Primary" resume
- [ ] Filter/sort options
- [ ] Enforce tier limits (3 for free, unlimited for paid)
- [ ] Upgrade prompt when at limit

---

#### US-E02-007: Set Primary Resume
**Priority:** P0 | **Points:** 2 | **Sprint:** 3

**As a** user  
**I want to** set a primary resume  
**So that** it's used by default for analysis

**Acceptance Criteria:**
- [ ] "Set as Primary" option on each resume
- [ ] Only one primary at a time
- [ ] Primary indicated with badge/icon
- [ ] Auto-select primary for new analyses
- [ ] Primary used for extension quick analysis

---

#### US-E02-008: Resume Version History
**Priority:** P1 | **Points:** 5 | **Sprint:** 6

**As a** user  
**I want to** see version history of my resume  
**So that** I can track changes over time

**Acceptance Criteria:**
- [ ] Version list with timestamps
- [ ] View any previous version
- [ ] Restore previous version option
- [ ] "Create new version" explicitly
- [ ] Auto-version on significant changes
- [ ] Version comparison (diff view)

---

#### US-E02-009: Generate Resume Embeddings
**Priority:** P0 | **Points:** 5 | **Sprint:** 3

**As the** system  
**I want to** generate embeddings for resumes  
**So that** I can perform semantic matching

**Acceptance Criteria:**
- [ ] Generate embeddings after parsing
- [ ] Use OpenAI text-embedding-3-small
- [ ] Store in Qdrant with resume ID metadata
- [ ] Re-generate on resume edit
- [ ] Handle embedding errors gracefully

---

#### US-E02-010: Delete Resume
**Priority:** P0 | **Points:** 3 | **Sprint:** 3

**As a** user  
**I want to** delete a resume  
**So that** I can remove unwanted versions

**Acceptance Criteria:**
- [ ] Delete button on resume card
- [ ] Confirmation dialog
- [ ] Soft delete with 30-day recovery
- [ ] Remove from active list immediately
- [ ] Delete embeddings from vector store
- [ ] Cannot delete primary (must set another first)

---

### 3.3 Epic E03: Chrome Extension

#### US-E03-001: Extension Installation & Auth
**Priority:** P0 | **Points:** 5 | **Sprint:** 4

**As a** user  
**I want to** install the Chrome extension and link it to my account  
**So that** I can analyze jobs while browsing

**Acceptance Criteria:**
- [ ] Extension available in Chrome Web Store
- [ ] "Connect Account" flow in popup
- [ ] OAuth-based authentication
- [ ] Show logged-in user in popup
- [ ] Logout option
- [ ] Sync status with web app

---

#### US-E03-002: Detect Job on LinkedIn
**Priority:** P0 | **Points:** 8 | **Sprint:** 4-5

**As a** user browsing LinkedIn Jobs  
**I want to** have jobs automatically detected  
**So that** I can analyze them with one click

**Acceptance Criteria:**
- [ ] Detect when viewing job detail page
- [ ] Show indicator icon on extension
- [ ] Badge count shows "Job Detected"
- [ ] Works on linkedin.com/jobs/* URLs
- [ ] Handles dynamic content loading
- [ ] Updates when navigating between jobs
- [ ] Works in both logged-in and public views

---

#### US-E03-003: Detect Job on Indeed
**Priority:** P0 | **Points:** 5 | **Sprint:** 5

**As a** user browsing Indeed  
**I want to** have jobs automatically detected  
**So that** I can analyze them

**Acceptance Criteria:**
- [ ] Detect job detail pages on indeed.com
- [ ] Extract job data from page
- [ ] Show detection indicator
- [ ] Handle different Indeed layouts

---

#### US-E03-004: Detect Job on Wellfound
**Priority:** P1 | **Points:** 5 | **Sprint:** 5

**As a** user browsing Wellfound (AngelList)  
**I want to** have startup jobs detected  
**So that** I can analyze them

**Acceptance Criteria:**
- [ ] Detect job pages on wellfound.com
- [ ] Extract job and company data
- [ ] Handle startup-specific fields (funding, size)

---

#### US-E03-005: Extract Job Data
**Priority:** P0 | **Points:** 8 | **Sprint:** 4-5

**As the** extension  
**I want to** extract structured job data from pages  
**So that** I can send it for analysis

**Acceptance Criteria:**
- [ ] Extract job title
- [ ] Extract company name
- [ ] Extract location
- [ ] Extract job type
- [ ] Extract salary (if present)
- [ ] Extract full description text
- [ ] Extract requirements/qualifications
- [ ] Extract posting date (if present)
- [ ] Store source URL

---

#### US-E03-006: Extension Popup UI
**Priority:** P0 | **Points:** 5 | **Sprint:** 5

**As a** user  
**I want to** see job info and actions in the popup  
**So that** I can quickly analyze or save jobs

**Acceptance Criteria:**
- [ ] Show job title and company
- [ ] Show match score (if resume uploaded)
- [ ] Show top 3 missing skills
- [ ] "Analyze Full" button → opens web app
- [ ] "Save Job" button
- [ ] "View Saved" button
- [ ] Popup loads in under 500ms
- [ ] Clean, minimal design

---

#### US-E03-007: Quick Analysis in Popup
**Priority:** P0 | **Points:** 5 | **Sprint:** 6

**As a** user  
**I want to** see a quick match score in the popup  
**So that** I can decide if the job is worth pursuing

**Acceptance Criteria:**
- [ ] Send job + resume to API
- [ ] Display match percentage
- [ ] Show 3 key missing skills
- [ ] Show "Good match" / "Fair match" / "Low match" label
- [ ] Cache result to avoid re-calling
- [ ] Loading state while processing

---

#### US-E03-008: Save Job from Extension
**Priority:** P0 | **Points:** 3 | **Sprint:** 6

**As a** user  
**I want to** save a job to my tracker from the extension  
**So that** I don't have to leave the job board

**Acceptance Criteria:**
- [ ] "Save Job" button in popup
- [ ] Save extracted job data to backend
- [ ] Add to job tracker as "Saved" status
- [ ] Show success confirmation
- [ ] Button changes to "Saved ✓"
- [ ] Link to view in web app

---

### 3.4 Epic E04: Job Analysis & ATS Scoring

#### US-E04-001: Calculate ATS Match Score
**Priority:** P0 | **Points:** 8 | **Sprint:** 5-6

**As a** user  
**I want to** see an ATS compatibility score  
**So that** I understand my chances of passing automated screening

**Acceptance Criteria:**
- [ ] Overall score 0-100
- [ ] Keyword match component (30%)
- [ ] Experience alignment component (25%)
- [ ] Education match component (15%)
- [ ] Skills relevance component (15%)
- [ ] Format compatibility component (15%)
- [ ] Score calculated within 10 seconds
- [ ] Score breakdown visible

---

#### US-E04-002: Identify Missing Keywords
**Priority:** P0 | **Points:** 5 | **Sprint:** 6

**As a** user  
**I want to** see which keywords I'm missing  
**So that** I can add them to my resume

**Acceptance Criteria:**
- [ ] List of required keywords not in resume
- [ ] Priority ranking (most important first)
- [ ] Category labels (skills, experience, etc.)
- [ ] Suggested placement locations
- [ ] Show how many times keyword appears in JD

---

#### US-E04-003: Identify Missing Skills
**Priority:** P0 | **Points:** 5 | **Sprint:** 6

**As a** user  
**I want to** see which skills I'm missing  
**So that** I know what to learn or highlight

**Acceptance Criteria:**
- [ ] Required skills not in resume
- [ ] Preferred skills not in resume
- [ ] Differentiate required vs preferred
- [ ] Suggest synonyms user might have
- [ ] Link to learning resources (Phase 2)

---

#### US-E04-004: Score Visualization
**Priority:** P0 | **Points:** 3 | **Sprint:** 6

**As a** user  
**I want to** see my ATS score visually  
**So that** I can quickly understand my position

**Acceptance Criteria:**
- [ ] Circular progress gauge for overall score
- [ ] Color coding (red < 50, yellow 50-75, green > 75)
- [ ] Bar charts for dimension breakdown
- [ ] Animation on score reveal
- [ ] Comparison to "average applicant" baseline

---

#### US-E04-005: Generate Improvement Suggestions
**Priority:** P0 | **Points:** 8 | **Sprint:** 6-7

**As a** user  
**I want to** see specific suggestions to improve my score  
**So that** I can take action

**Acceptance Criteria:**
- [ ] Prioritized list of suggestions
- [ ] Estimated score impact per suggestion
- [ ] Specific wording recommendations
- [ ] "Apply suggestion" button (Phase 2)
- [ ] Limit to top 10 suggestions
- [ ] Group by category (keywords, format, etc.)

---

#### US-E04-006: Manual Job Entry
**Priority:** P1 | **Points:** 5 | **Sprint:** 7

**As a** user  
**I want to** manually enter a job posting  
**So that** I can analyze jobs from unsupported sites

**Acceptance Criteria:**
- [ ] "Add Job Manually" button
- [ ] Form with job fields (title, company, etc.)
- [ ] Paste job description option
- [ ] Parse pasted text into structured fields
- [ ] Save and trigger analysis

---

#### US-E04-007: View Full Job Analysis
**Priority:** P0 | **Points:** 5 | **Sprint:** 7

**As a** user  
**I want to** see a comprehensive job analysis page  
**So that** I can make informed application decisions

**Acceptance Criteria:**
- [ ] Job details summary
- [ ] ATS score with full breakdown
- [ ] Missing keywords section
- [ ] Missing skills section
- [ ] Improvement suggestions
- [ ] Resume used for analysis
- [ ] "Generate Cover Letter" CTA
- [ ] "Optimize Resume" CTA

---

#### US-E04-008: Compare Against Multiple Resumes
**Priority:** P2 | **Points:** 5 | **Sprint:** 8

**As a** user  
**I want to** see how different resumes score against a job  
**So that** I can choose the best one to submit

**Acceptance Criteria:**
- [ ] "Compare Resumes" option on analysis page
- [ ] Select up to 3 resumes
- [ ] Side-by-side score comparison
- [ ] Highlight differences
- [ ] Recommend best resume

---

### 3.5 Epic E05: AI Document Generation

#### US-E05-001: Generate Cover Letter
**Priority:** P0 | **Points:** 8 | **Sprint:** 7-8

**As a** user  
**I want to** generate a tailored cover letter  
**So that** I can submit a compelling application

**Acceptance Criteria:**
- [ ] Generate from job + resume data
- [ ] Tone selection (Professional, Enthusiastic, Conversational)
- [ ] Length selection (Short ~150 words, Medium ~250, Long ~350)
- [ ] Include company name and role
- [ ] Highlight relevant experience
- [ ] Generate within 15 seconds
- [ ] Show loading state with progress
- [ ] Display in editable text area

---

#### US-E05-002: Cover Letter Customization Options
**Priority:** P0 | **Points:** 3 | **Sprint:** 8

**As a** user  
**I want to** customize the cover letter generation  
**So that** it matches my preferences

**Acceptance Criteria:**
- [ ] Specify achievements to highlight (optional)
- [ ] Specify experiences to include/exclude
- [ ] Add custom opening hook (optional)
- [ ] Specify company research points to include
- [ ] Save preferences for future generations

---

#### US-E05-003: Edit Generated Cover Letter
**Priority:** P0 | **Points:** 3 | **Sprint:** 8

**As a** user  
**I want to** edit the generated cover letter  
**So that** I can personalize it further

**Acceptance Criteria:**
- [ ] Inline editing in text area
- [ ] Basic formatting (bold, italic)
- [ ] Word count display
- [ ] "Reset to Generated" option
- [ ] Auto-save edits

---

#### US-E05-004: Regenerate Cover Letter
**Priority:** P0 | **Points:** 2 | **Sprint:** 8

**As a** user  
**I want to** regenerate with different options  
**So that** I can get alternative versions

**Acceptance Criteria:**
- [ ] "Regenerate" button
- [ ] Change tone/length options
- [ ] New generation replaces current
- [ ] Version history (last 3)
- [ ] Confirm before replacing edited version

---

#### US-E05-005: Export Cover Letter
**Priority:** P0 | **Points:** 3 | **Sprint:** 8

**As a** user  
**I want to** export my cover letter  
**So that** I can submit it with my application

**Acceptance Criteria:**
- [ ] Copy to clipboard button
- [ ] Download as PDF
- [ ] Download as DOCX
- [ ] Download as plain text
- [ ] Clean, professional formatting

---

#### US-E05-006: Save Cover Letter to Job
**Priority:** P0 | **Points:** 2 | **Sprint:** 8

**As a** user  
**I want to** save the cover letter with the job  
**So that** I can track what I submitted

**Acceptance Criteria:**
- [ ] "Save to Job" button
- [ ] Link cover letter to job in tracker
- [ ] View saved cover letter from job detail
- [ ] Option to generate new version later

---

### 3.6 Epic E06: Job Tracker

#### US-E06-001: View Job Pipeline (Kanban)
**Priority:** P0 | **Points:** 8 | **Sprint:** 8-9

**As a** user  
**I want to** see my jobs in a Kanban board  
**So that** I can visualize my application pipeline

**Acceptance Criteria:**
- [ ] Columns for each status
- [ ] Job cards with title, company, date
- [ ] Card shows match score
- [ ] Scrollable columns
- [ ] Responsive design
- [ ] Empty state guidance

**Default Columns:**
1. Saved
2. Applied
3. Assessment
4. Recruiter Screen
5. Technical Interview
6. Hiring Manager
7. Final Round
8. Offer

---

#### US-E06-002: Drag-and-Drop Status Update
**Priority:** P0 | **Points:** 5 | **Sprint:** 9

**As a** user  
**I want to** drag jobs between columns  
**So that** I can update status quickly

**Acceptance Criteria:**
- [ ] Smooth drag animation
- [ ] Visual feedback on valid drop zones
- [ ] Update status in database
- [ ] Timestamp status change
- [ ] Optimistic UI update
- [ ] Undo option (5 seconds)

---

#### US-E06-003: View Job Details Panel
**Priority:** P0 | **Points:** 5 | **Sprint:** 9

**As a** user  
**I want to** view full job details in a side panel  
**So that** I don't lose pipeline context

**Acceptance Criteria:**
- [ ] Click card to open side panel
- [ ] Show all job fields
- [ ] Show ATS analysis summary
- [ ] Show saved cover letter
- [ ] Show application timeline
- [ ] Show notes
- [ ] Edit fields inline
- [ ] Close panel button

---

#### US-E06-004: Add Notes to Job
**Priority:** P0 | **Points:** 3 | **Sprint:** 9

**As a** user  
**I want to** add notes to a job  
**So that** I can track important information

**Acceptance Criteria:**
- [ ] Notes section in job detail
- [ ] Add new note with text
- [ ] Timestamp on each note
- [ ] Edit/delete existing notes
- [ ] Rich text support (links, bold)
- [ ] Notes visible in timeline

---

#### US-E06-005: Filter and Search Jobs
**Priority:** P0 | **Points:** 5 | **Sprint:** 9

**As a** user  
**I want to** filter and search my tracked jobs  
**So that** I can find specific applications

**Acceptance Criteria:**
- [ ] Search by job title, company
- [ ] Filter by status
- [ ] Filter by date range
- [ ] Filter by match score range
- [ ] Clear filters button
- [ ] Results count display

---

#### US-E06-006: Sort Jobs
**Priority:** P1 | **Points:** 2 | **Sprint:** 9

**As a** user  
**I want to** sort jobs within columns  
**So that** I can prioritize effectively

**Acceptance Criteria:**
- [ ] Sort by date added
- [ ] Sort by match score
- [ ] Sort by company name
- [ ] Sort order toggle (asc/desc)
- [ ] Persist sort preference

---

#### US-E06-007: Archive/Delete Job
**Priority:** P0 | **Points:** 3 | **Sprint:** 9

**As a** user  
**I want to** archive or delete tracked jobs  
**So that** I can keep my pipeline clean

**Acceptance Criteria:**
- [ ] Archive moves to hidden archive
- [ ] Delete permanently removes
- [ ] Confirmation for delete
- [ ] View archived jobs option
- [ ] Restore from archive

---

#### US-E06-008: Job Timeline View
**Priority:** P1 | **Points:** 5 | **Sprint:** 10

**As a** user  
**I want to** see a timeline of activity for each job  
**So that** I can track my progress

**Acceptance Criteria:**
- [ ] Timeline in job detail panel
- [ ] Show status changes with dates
- [ ] Show notes added
- [ ] Show documents saved
- [ ] Show reminders set
- [ ] Chronological order

---

#### US-E06-009: Free Tier Job Limit
**Priority:** P0 | **Points:** 3 | **Sprint:** 9

**As the** system  
**I want to** enforce job tracking limits  
**So that** free users are incentivized to upgrade

**Acceptance Criteria:**
- [ ] Free tier: 20 active jobs max
- [ ] Warning at 18 jobs
- [ ] Block new saves at 20
- [ ] Show upgrade prompt
- [ ] Archived jobs don't count toward limit
- [ ] Paid tiers: unlimited

---

### 3.7 Epic E07: Landing Page & Marketing

#### US-E07-001: Hero Section
**Priority:** P0 | **Points:** 5 | **Sprint:** 1

**As a** visitor  
**I want to** immediately understand the product  
**So that** I can decide if it's for me

**Acceptance Criteria:**
- [ ] Clear headline communicating value
- [ ] Subheadline with supporting text
- [ ] Primary CTA "Get Started Free"
- [ ] Secondary CTA "See Demo"
- [ ] Animated background (subtle)
- [ ] Product preview/screenshot
- [ ] Mobile responsive

---

#### US-E07-002: Features Section
**Priority:** P0 | **Points:** 5 | **Sprint:** 1

**As a** visitor  
**I want to** see the key features  
**So that** I understand what the product does

**Acceptance Criteria:**
- [ ] Feature cards with icons
- [ ] Brief descriptions
- [ ] Visual illustrations
- [ ] ATS scoring highlight
- [ ] Extension showcase
- [ ] AI generation preview
- [ ] Animated on scroll

---

#### US-E07-003: Pricing Section
**Priority:** P0 | **Points:** 3 | **Sprint:** 2

**As a** visitor  
**I want to** see pricing options  
**So that** I can evaluate the cost

**Acceptance Criteria:**
- [ ] Three tier cards (Free, Pro, Premium)
- [ ] Monthly/Annual toggle
- [ ] Feature comparison matrix
- [ ] Highlight "Most Popular"
- [ ] CTA buttons for each tier
- [ ] FAQ link

---

#### US-E07-004: Testimonials Section
**Priority:** P1 | **Points:** 3 | **Sprint:** 2

**As a** visitor  
**I want to** see social proof  
**So that** I trust the product

**Acceptance Criteria:**
- [ ] 3-6 testimonial cards
- [ ] Photo, name, title
- [ ] Quote text
- [ ] Company logo if applicable
- [ ] Carousel on mobile
- [ ] (Use placeholder data initially)

---

#### US-E07-005: Footer
**Priority:** P0 | **Points:** 2 | **Sprint:** 2

**As a** visitor  
**I want to** access important links  
**So that** I can learn more

**Acceptance Criteria:**
- [ ] Navigation links (Features, Pricing, Blog)
- [ ] Legal links (Privacy, Terms)
- [ ] Social media links
- [ ] Contact information
- [ ] Copyright notice
- [ ] Newsletter signup

---

### 3.8 Epic E08: Dashboard

#### US-E08-001: Dashboard Overview
**Priority:** P1 | **Points:** 5 | **Sprint:** 10

**As a** user  
**I want to** see an overview dashboard  
**So that** I can understand my job search at a glance

**Acceptance Criteria:**
- [ ] Quick stats cards (applications, interviews, offers)
- [ ] Recent activity feed
- [ ] Upcoming reminders
- [ ] Quick action buttons
- [ ] AI usage meter (for limits)
- [ ] Progress indicators

---

#### US-E08-002: Application Statistics
**Priority:** P1 | **Points:** 3 | **Sprint:** 10

**As a** user  
**I want to** see application statistics  
**So that** I can track my progress

**Acceptance Criteria:**
- [ ] Total applications count
- [ ] Applications this week/month
- [ ] Response rate percentage
- [ ] Interview conversion rate
- [ ] Average time per stage

---

#### US-E08-003: Recent Activity Feed
**Priority:** P1 | **Points:** 3 | **Sprint:** 10

**As a** user  
**I want to** see recent activity  
**So that** I know what I've been doing

**Acceptance Criteria:**
- [ ] Chronological activity list
- [ ] Activities: job saved, status changed, document generated
- [ ] Click to navigate to item
- [ ] Show last 10 activities
- [ ] "View All" option

---

#### US-E08-004: Quick Actions
**Priority:** P1 | **Points:** 2 | **Sprint:** 10

**As a** user  
**I want to** access common actions quickly  
**So that** I can be efficient

**Acceptance Criteria:**
- [ ] "Upload Resume" button
- [ ] "Add Job" button
- [ ] "View Tracker" button
- [ ] Keyboard shortcuts (Phase 2)

---

## 4. Product Backlog

### 4.1 MVP Backlog (Prioritized)

| Rank | Story ID | Story Title | Points | Sprint | Status |
|------|----------|-------------|--------|--------|--------|
| 1 | US-E07-001 | Hero Section | 5 | 1 | To Do |
| 2 | US-E07-002 | Features Section | 5 | 1 | To Do |
| 3 | US-E01-001 | Email Registration | 5 | 1 | To Do |
| 4 | US-E01-002 | Google OAuth Login | 3 | 1 | To Do |
| 5 | US-E01-003 | GitHub OAuth Login | 3 | 1 | To Do |
| 6 | US-E01-004 | Password Reset | 3 | 1 | To Do |
| 7 | US-E01-006 | Email Verification | 3 | 1 | To Do |
| 8 | US-E01-007 | User Logout | 2 | 1 | To Do |
| 9 | US-E07-003 | Pricing Section | 3 | 2 | To Do |
| 10 | US-E07-004 | Testimonials Section | 3 | 2 | To Do |
| 11 | US-E07-005 | Footer | 2 | 2 | To Do |
| 12 | US-E01-005 | User Profile View & Edit | 5 | 2 | To Do |
| 13 | US-E01-008 | Session Management | 5 | 2 | To Do |
| 14 | US-E01-011 | Theme Selection | 3 | 2 | To Do |
| 15 | US-E01-012 | Account Lockout Protection | 3 | 2 | To Do |
| 16 | US-E02-001 | Upload Resume (PDF) | 5 | 2 | To Do |
| 17 | US-E02-002 | Upload Resume (DOCX) | 3 | 2 | To Do |
| 18 | US-E02-003 | Parse Resume Content | 13 | 2-3 | To Do |
| 19 | US-E01-009 | Account Deletion | 5 | 3 | To Do |
| 20 | US-E01-010 | Notification Preferences | 3 | 3 | To Do |
| 21 | US-E02-004 | View Parsed Resume | 5 | 3 | To Do |
| 22 | US-E02-005 | Edit Parsed Resume Data | 5 | 3 | To Do |
| 23 | US-E02-006 | Manage Multiple Resumes | 5 | 3 | To Do |
| 24 | US-E02-007 | Set Primary Resume | 2 | 3 | To Do |
| 25 | US-E02-009 | Generate Resume Embeddings | 5 | 3 | To Do |
| 26 | US-E02-010 | Delete Resume | 3 | 3 | To Do |
| 27 | US-E03-001 | Extension Installation & Auth | 5 | 4 | To Do |
| 28 | US-E03-002 | Detect Job on LinkedIn | 8 | 4-5 | To Do |
| 29 | US-E03-005 | Extract Job Data | 8 | 4-5 | To Do |
| 30 | US-E03-003 | Detect Job on Indeed | 5 | 5 | To Do |
| 31 | US-E03-004 | Detect Job on Wellfound | 5 | 5 | To Do |
| 32 | US-E03-006 | Extension Popup UI | 5 | 5 | To Do |
| 33 | US-E04-001 | Calculate ATS Match Score | 8 | 5-6 | To Do |
| 34 | US-E03-007 | Quick Analysis in Popup | 5 | 6 | To Do |
| 35 | US-E03-008 | Save Job from Extension | 3 | 6 | To Do |
| 36 | US-E04-002 | Identify Missing Keywords | 5 | 6 | To Do |
| 37 | US-E04-003 | Identify Missing Skills | 5 | 6 | To Do |
| 38 | US-E04-004 | Score Visualization | 3 | 6 | To Do |
| 39 | US-E04-005 | Generate Improvement Suggestions | 8 | 6-7 | To Do |
| 40 | US-E04-006 | Manual Job Entry | 5 | 7 | To Do |
| 41 | US-E04-007 | View Full Job Analysis | 5 | 7 | To Do |
| 42 | US-E05-001 | Generate Cover Letter | 8 | 7-8 | To Do |
| 43 | US-E05-002 | Cover Letter Customization | 3 | 8 | To Do |
| 44 | US-E05-003 | Edit Generated Cover Letter | 3 | 8 | To Do |
| 45 | US-E05-004 | Regenerate Cover Letter | 2 | 8 | To Do |
| 46 | US-E05-005 | Export Cover Letter | 3 | 8 | To Do |
| 47 | US-E05-006 | Save Cover Letter to Job | 2 | 8 | To Do |
| 48 | US-E06-001 | View Job Pipeline (Kanban) | 8 | 8-9 | To Do |
| 49 | US-E06-002 | Drag-and-Drop Status Update | 5 | 9 | To Do |
| 50 | US-E06-003 | View Job Details Panel | 5 | 9 | To Do |
| 51 | US-E06-004 | Add Notes to Job | 3 | 9 | To Do |
| 52 | US-E06-005 | Filter and Search Jobs | 5 | 9 | To Do |
| 53 | US-E06-006 | Sort Jobs | 2 | 9 | To Do |
| 54 | US-E06-007 | Archive/Delete Job | 3 | 9 | To Do |
| 55 | US-E06-009 | Free Tier Job Limit | 3 | 9 | To Do |
| 56 | US-E06-008 | Job Timeline View | 5 | 10 | To Do |
| 57 | US-E08-001 | Dashboard Overview | 5 | 10 | To Do |
| 58 | US-E08-002 | Application Statistics | 3 | 10 | To Do |
| 59 | US-E08-003 | Recent Activity Feed | 3 | 10 | To Do |
| 60 | US-E08-004 | Quick Actions | 2 | 10 | To Do |

**MVP Total: 262 Story Points across 10 Sprints**

---

## 5. Sprint Planning

### 5.1 Sprint Capacity

| Parameter | Value |
|-----------|-------|
| Sprint Duration | 2 weeks |
| Team Size | 4 developers |
| Velocity (estimated) | 25-30 points/sprint |
| MVP Sprints | 10 sprints (20 weeks) |

### 5.2 Sprint Breakdown

#### Sprint 1: Foundation & Landing (30 points)
**Goal:** Live landing page with authentication

| Story | Points |
|-------|--------|
| US-E07-001 Hero Section | 5 |
| US-E07-002 Features Section | 5 |
| US-E01-001 Email Registration | 5 |
| US-E01-002 Google OAuth Login | 3 |
| US-E01-003 GitHub OAuth Login | 3 |
| US-E01-004 Password Reset | 3 |
| US-E01-006 Email Verification | 3 |
| US-E01-007 User Logout | 2 |
| **Total** | **29** |

#### Sprint 2: Landing Complete & Resume Upload (32 points)
**Goal:** Complete landing page, start resume functionality

| Story | Points |
|-------|--------|
| US-E07-003 Pricing Section | 3 |
| US-E07-004 Testimonials | 3 |
| US-E07-005 Footer | 2 |
| US-E01-005 User Profile | 5 |
| US-E01-008 Session Management | 5 |
| US-E01-011 Theme Selection | 3 |
| US-E01-012 Account Lockout | 3 |
| US-E02-001 Upload Resume (PDF) | 5 |
| US-E02-002 Upload Resume (DOCX) | 3 |
| **Total** | **32** |

#### Sprint 3: Resume Intelligence (33 points)
**Goal:** Full resume parsing and management

| Story | Points |
|-------|--------|
| US-E02-003 Parse Resume Content | 13 |
| US-E01-009 Account Deletion | 5 |
| US-E01-010 Notification Preferences | 3 |
| US-E02-004 View Parsed Resume | 5 |
| US-E02-005 Edit Parsed Data | 5 |
| US-E02-007 Set Primary Resume | 2 |
| **Total** | **33** |

#### Sprint 4: Resume Complete & Extension Start (18 points)
**Goal:** Finish resume features, begin extension

| Story | Points |
|-------|--------|
| US-E02-006 Manage Multiple Resumes | 5 |
| US-E02-009 Generate Embeddings | 5 |
| US-E02-010 Delete Resume | 3 |
| US-E03-001 Extension Auth | 5 |
| **Total** | **18** |

#### Sprint 5: Extension Job Detection (31 points)
**Goal:** Extension detects jobs on major platforms

| Story | Points |
|-------|--------|
| US-E03-002 Detect Job on LinkedIn | 8 |
| US-E03-005 Extract Job Data | 8 |
| US-E03-003 Detect Job on Indeed | 5 |
| US-E03-004 Detect Job on Wellfound | 5 |
| US-E03-006 Extension Popup UI | 5 |
| **Total** | **31** |

#### Sprint 6: ATS Scoring (29 points)
**Goal:** Full ATS analysis capability

| Story | Points |
|-------|--------|
| US-E04-001 Calculate ATS Score | 8 |
| US-E03-007 Quick Analysis in Popup | 5 |
| US-E03-008 Save Job from Extension | 3 |
| US-E04-002 Identify Missing Keywords | 5 |
| US-E04-003 Identify Missing Skills | 5 |
| US-E04-004 Score Visualization | 3 |
| **Total** | **29** |

#### Sprint 7: Suggestions & Manual Entry (18 points)
**Goal:** Complete job analysis features

| Story | Points |
|-------|--------|
| US-E04-005 Generate Suggestions | 8 |
| US-E04-006 Manual Job Entry | 5 |
| US-E04-007 View Full Job Analysis | 5 |
| **Total** | **18** |

#### Sprint 8: Cover Letter Generation (29 points)
**Goal:** AI cover letter feature complete

| Story | Points |
|-------|--------|
| US-E05-001 Generate Cover Letter | 8 |
| US-E05-002 Cover Letter Customization | 3 |
| US-E05-003 Edit Generated Cover Letter | 3 |
| US-E05-004 Regenerate Cover Letter | 2 |
| US-E05-005 Export Cover Letter | 3 |
| US-E05-006 Save Cover Letter to Job | 2 |
| US-E06-001 View Job Pipeline | 8 |
| **Total** | **29** |

#### Sprint 9: Job Tracker (26 points)
**Goal:** Full job tracking capability

| Story | Points |
|-------|--------|
| US-E06-002 Drag-and-Drop | 5 |
| US-E06-003 Job Details Panel | 5 |
| US-E06-004 Add Notes | 3 |
| US-E06-005 Filter and Search | 5 |
| US-E06-006 Sort Jobs | 2 |
| US-E06-007 Archive/Delete | 3 |
| US-E06-009 Free Tier Limit | 3 |
| **Total** | **26** |

#### Sprint 10: Dashboard & Polish (18 points)
**Goal:** Dashboard complete, MVP ready

| Story | Points |
|-------|--------|
| US-E06-008 Job Timeline View | 5 |
| US-E08-001 Dashboard Overview | 5 |
| US-E08-002 Application Statistics | 3 |
| US-E08-003 Recent Activity Feed | 3 |
| US-E08-004 Quick Actions | 2 |
| **Total** | **18** |

---

## 6. Story Point Reference

### 6.1 Point Scale Definition

| Points | Effort | Duration | Complexity | Example |
|--------|--------|----------|------------|---------|
| 1 | Trivial | < 2 hours | No unknowns | Copy change, config update |
| 2 | Small | 2-4 hours | Well understood | Simple UI component |
| 3 | Medium-Small | 4-8 hours | Minor unknowns | Form with validation |
| 5 | Medium | 1-2 days | Some unknowns | CRUD feature, API endpoint |
| 8 | Large | 2-4 days | Significant unknowns | Complex feature, integration |
| 13 | X-Large | 4-7 days | Many unknowns | Major feature, new technology |
| 21 | Epic | > 1 week | High uncertainty | Should be broken down |

### 6.2 Definition of Done

A story is "Done" when:

- [ ] Code complete and passing linting
- [ ] Unit tests written and passing (>80% coverage)
- [ ] Integration tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Acceptance criteria verified
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] No critical bugs
- [ ] Performance within targets

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-07-27 | Product Team | Initial backlog |

---

*This backlog is a living document and should be refined each sprint.*
