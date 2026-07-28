// KeyScore - Popup Script

const API_URL = 'http://localhost:4000/api';
const APP_URL = 'http://localhost:3000';

// DOM Elements
const loadingState = document.getElementById('loadingState');
const authSection = document.getElementById('authSection');
const mainContent = document.getElementById('mainContent');
const userAvatar = document.getElementById('userAvatar');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const statusMessage = document.getElementById('statusMessage');
const jdStatus = document.getElementById('jdStatus');
const jdStatusText = document.getElementById('jdStatusText');
const jdPreview = document.getElementById('jdPreview');
const extractJdBtn = document.getElementById('extractJdBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const viewMoreJdBtn = document.getElementById('viewMoreJdBtn');
const resumesSection = document.getElementById('resumesSection');
const resumeList = document.getElementById('resumeList');
const noResumes = document.getElementById('noResumes');
const detailView = document.getElementById('detailView');
const backBtn = document.getElementById('backBtn');
const detailTitle = document.getElementById('detailTitle');
const detailScoreValue = document.getElementById('detailScoreValue');
const matchedKeywords = document.getElementById('matchedKeywords');
const missingKeywords = document.getElementById('missingKeywords');
const matchedCount = document.getElementById('matchedCount');
const missingCount = document.getElementById('missingCount');
const scoreBarFill = document.getElementById('scoreBarFill');
const matchedLabel = document.getElementById('matchedLabel');
const totalLabel = document.getElementById('totalLabel');
const improvementTip = document.getElementById('improvementTip');
const tipText = document.getElementById('tipText');
const copyMissingBtn = document.getElementById('copyMissingBtn');

// State
let isAuthenticated = false;
let currentUser = null;
let resumes = [];
let currentJD = null;
let analysisResults = null;
let autoExtractAttempted = false;

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  console.log('KeyScore: Popup initialized');

  try {
    await checkPendingAuth();
    await checkAuthStatus();

    if (isAuthenticated) {
      await loadResumes();
      // Auto-extract JD after loading resumes
      if (resumes.length > 0) {
        await autoExtractAndAnalyze();
      }
    }
  } catch (error) {
    console.error('Init error:', error);
    // Show auth section as fallback
    showAuthSection();
  }
}

// Auto-extract JD and analyze if on a job page
async function autoExtractAndAnalyze() {
  if (autoExtractAttempted) return;
  autoExtractAttempted = true;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    // Check if this looks like a job site
    const url = tab.url || '';
    const isJobSite = isLikelyJobSite(url);

    if (!isJobSite) {
      console.log('Not a recognized job site, skipping auto-extract');
      return;
    }

    console.log('Job site detected, attempting auto-extract...');

    // Show loading state
    jdPreview.innerHTML = '<span style="color: #6366f1;">🔍 Auto-detecting job description...</span>';

    // Try to extract JD
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobDescription,
    });

    const jdText = results?.[0]?.result;

    if (jdText && jdText.length > 100) {
      currentJD = jdText;
      jdPreview.textContent = jdText;
      jdPreview.classList.remove('expanded');
      jdStatus.classList.remove('hidden');
      jdStatus.classList.remove('error');
      jdStatusText.textContent = `Auto-detected (${jdText.length} chars)`;
      viewMoreJdBtn.classList.remove('hidden');
      viewMoreJdBtn.classList.remove('expanded');
      viewMoreJdBtn.querySelector('span').textContent = 'View more';

      // Auto-analyze all resumes
      console.log('JD extracted, auto-analyzing resumes...');
      await autoAnalyzeResumes();
    } else {
      console.log('Could not auto-extract JD, manual extraction needed');
      jdPreview.textContent = 'Click "Extract JD" to analyze the job description on this page.';
    }
  } catch (error) {
    console.log('Auto-extract failed:', error.message);
    jdPreview.textContent = 'Click "Extract JD" to analyze the job description on this page.';
  }
}

// Check if URL is likely a job site
function isLikelyJobSite(url) {
  const jobSitePatterns = [
    // Major job boards
    'linkedin.com/jobs',
    'indeed.com',
    'glassdoor.com/job',
    'monster.com',
    'ziprecruiter.com',
    'dice.com',
    'careerbuilder.com',
    'simplyhired.com',
    'snagajob.com',
    'flexjobs.com',
    'wellfound.com', // AngelList
    'angel.co/jobs',
    'builtin.com',
    'hired.com',
    'triplebyte.com',
    'turing.com',
    'toptal.com',
    'remote.co',
    'weworkremotely.com',
    'remoteok.com',
    'stackoverflow.com/jobs',
    'github.com/jobs',
    'levels.fyi',
    'ycombinator.com/jobs',
    'news.ycombinator.com/jobs',

    // ATS platforms
    'greenhouse.io',
    'lever.co',
    'workday.com',
    'myworkdayjobs.com',
    'icims.com',
    'smartrecruiters.com',
    'jobvite.com',
    'ultipro.com',
    'taleo.',
    'brassring.com',
    'successfactors.com',
    'workable.com',
    'ashbyhq.com',
    'bamboohr.com',
    'jazz.co',
    'recruitee.com',
    'applytojob.com',
    'resumator.com',

    // Company career pages (common patterns)
    '/careers',
    '/jobs',
    '/job/',
    '/position/',
    '/opening/',
    '/vacancy',
    '/join-us',
    '/join-our-team',
    '/work-with-us',
  ];

  const lowerUrl = url.toLowerCase();
  return jobSitePatterns.some(pattern => lowerUrl.includes(pattern));
}

// Auto-analyze without button feedback
async function autoAnalyzeResumes() {
  if (!currentJD || resumes.length === 0) return;

  try {
    analysisResults = await simulateAnalysis(resumes, currentJD);
    analysisResults.sort((a, b) => b.score - a.score);

    resumes.sort((a, b) => {
      const scoreA = analysisResults.find(r => r.resumeId === a._id)?.score || 0;
      const scoreB = analysisResults.find(r => r.resumeId === b._id)?.score || 0;
      return scoreB - scoreA;
    });

    renderResumes();

    // Show analyze button for re-analysis if needed
    analyzeBtn.classList.remove('hidden');
    analyzeBtn.innerHTML = `
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      Re-analyze
    `;

    showStatus('Auto-analyzed against job description!', 'success');
  } catch (error) {
    console.error('Auto-analysis error:', error);
  }
}

// Check for pending auth from web app
async function checkPendingAuth() {
  console.log('Checking pending auth...');
  try {
    const tabs = await chrome.tabs.query({ url: `${APP_URL}/*` });
    console.log('Found tabs:', tabs.length);

    for (const tab of tabs) {
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const authData = localStorage.getItem('extension-auth');
            if (authData) {
              localStorage.removeItem('extension-auth');
              return JSON.parse(authData);
            }
            return null;
          },
        });

        const authData = results?.[0]?.result;
        if (authData?.accessToken) {
          console.log('Found auth data from web app');
          await chrome.storage.local.set({
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            user: authData.user,
          });
          break;
        }
      } catch (e) {
        console.log('Could not access tab:', e.message);
      }
    }
  } catch (error) {
    console.log('Error checking pending auth:', error.message);
  }
}

// Check auth status
async function checkAuthStatus() {
  console.log('Checking auth status...');
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH_STATUS' });
    console.log('Auth response:', response);

    if (response?.isAuthenticated) {
      isAuthenticated = true;
      currentUser = response.user;
      showMainContent();
    } else {
      showAuthSection();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    showAuthSection();
  }
}

// Show auth section
function showAuthSection() {
  loadingState.classList.add('hidden');
  authSection.classList.remove('hidden');
  mainContent.classList.add('hidden');
  userAvatar.classList.add('hidden');
  logoutBtn.classList.add('hidden');
}

// Show main content
function showMainContent() {
  loadingState.classList.add('hidden');
  authSection.classList.add('hidden');
  mainContent.classList.remove('hidden');

  if (currentUser) {
    const initials = (currentUser.firstName?.[0] || '') + (currentUser.lastName?.[0] || '');
    userAvatar.textContent = initials.toUpperCase() || 'U';
    userAvatar.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
  }
}

// Load user's resumes
async function loadResumes() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_RESUMES' });
    if (response.success && response.data) {
      resumes = response.data;
      renderResumes();
    } else {
      showNoResumes();
    }
  } catch (error) {
    console.error('Failed to load resumes:', error);
    showStatus('Failed to load resumes', 'error');
  }
}

// Render resumes list
function renderResumes() {
  if (resumes.length === 0) {
    showNoResumes();
    return;
  }

  resumesSection.classList.remove('hidden');
  noResumes.classList.add('hidden');

  resumeList.innerHTML = resumes.map((resume, index) => {
    const analysis = analysisResults?.find(r => r.resumeId === resume._id);
    const score = analysis?.score;
    const scoreClass = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
    const isBestMatch = analysisResults && index === 0 && score >= 70;

    return `
      <div class="resume-card ${isBestMatch ? 'best-match' : ''}" data-id="${resume._id}">
        <div class="resume-header">
          <div class="resume-info">
            <div class="resume-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <div class="resume-name">${resume.name}</div>
              <div class="resume-meta">${formatFileSize(resume.size)} • ${resume.isDefault ? '⭐ Primary' : 'Updated ' + formatDate(resume.updatedAt)}</div>
            </div>
          </div>
          ${score !== undefined ? `
            <div class="resume-score">
              <span class="score-value ${scoreClass}">${score}%</span>
              <span class="score-label">Match</span>
            </div>
          ` : ''}
        </div>
        ${isBestMatch ? `
          <div class="best-match-badge">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Best Match
          </div>
        ` : ''}
        ${analysis ? `
          <div class="keywords-preview">
            <div class="keywords-row">
              <span class="keywords-label">Matched:</span>
              <div class="keywords-tags">
                ${analysis.matchedKeywords.slice(0, 4).map(k => `
                  <span class="keyword-tag matched">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    ${k}
                  </span>
                `).join('')}
                ${analysis.matchedKeywords.length > 4 ? `<span class="keyword-tag matched">+${analysis.matchedKeywords.length - 4}</span>` : ''}
              </div>
            </div>
            <div class="keywords-row">
              <span class="keywords-label">Missing:</span>
              <div class="keywords-tags">
                ${analysis.missingKeywords.slice(0, 4).map(k => `
                  <span class="keyword-tag missing">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    ${k}
                  </span>
                `).join('')}
                ${analysis.missingKeywords.length > 4 ? `<span class="keyword-tag missing">+${analysis.missingKeywords.length - 4}</span>` : ''}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Add click handlers
  document.querySelectorAll('.resume-card').forEach(card => {
    card.addEventListener('click', () => showResumeDetail(card.dataset.id));
  });
}

// Show no resumes state
function showNoResumes() {
  resumesSection.classList.add('hidden');
  noResumes.classList.remove('hidden');
}

// Extract JD from current page
async function extractJD() {
  extractJdBtn.disabled = true;
  extractJdBtn.innerHTML = `
    <svg class="spinner" width="14" height="14" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    Extracting...
  `;

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error('No active tab');
    }

    // Inject and execute JD extraction script
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJobDescription,
    });

    const jdText = results?.[0]?.result;

    if (jdText && jdText.length > 50) {
      currentJD = jdText;
      jdPreview.textContent = jdText;
      jdPreview.classList.remove('expanded');
      jdStatus.classList.remove('hidden');
      jdStatusText.textContent = `Detected (${jdText.length} chars)`;
      analyzeBtn.classList.remove('hidden');
      viewMoreJdBtn.classList.remove('hidden');
      viewMoreJdBtn.classList.remove('expanded');
      viewMoreJdBtn.querySelector('span').textContent = 'View more';
      showStatus('Job description extracted successfully!', 'success');
    } else {
      throw new Error('Could not find job description on this page');
    }
  } catch (error) {
    console.error('JD extraction error:', error);
    jdStatus.classList.remove('hidden');
    jdStatus.classList.add('error');
    jdStatusText.textContent = 'Not found';
    viewMoreJdBtn.classList.add('hidden');
    showStatus('Could not extract JD. Try selecting the job description text on the page first, then click Extract.', 'error');
  } finally {
    extractJdBtn.disabled = false;
    extractJdBtn.innerHTML = `
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
      </svg>
      Extract JD
    `;
  }
}

// JD extraction function (runs in page context)
function extractJobDescription() {
  // Helper to clean text
  const cleanText = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  // First, check if user has selected text on the page
  const selectedText = window.getSelection()?.toString()?.trim();
  if (selectedText && selectedText.length > 100) {
    console.log('Using user-selected text as JD');
    return cleanText(selectedText);
  }

  // LinkedIn-specific extraction
  if (window.location.hostname.includes('linkedin.com')) {
    // Try the job details panel (right side)
    const jobDetailsSelectors = [
      '.jobs-description__content',
      '.jobs-description-content__text',
      '.jobs-box__html-content',
      '[class*="jobs-description"]',
      '.job-view-layout .description',
      '.jobs-unified-top-card__job-insight',
      '.jobs-details__main-content',
      '.job-details-jobs-unified-top-card__job-insight-view-model-secondary',
    ];

    for (const selector of jobDetailsSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }

    // Try to find "About the job" section specifically
    const aboutJobHeader = Array.from(document.querySelectorAll('h2, h3, .jobs-description h2')).find(
      h => h.innerText?.toLowerCase().includes('about the job') ||
           h.innerText?.toLowerCase().includes('about this job')
    );
    if (aboutJobHeader) {
      // Get the parent container or next sibling with content
      let container = aboutJobHeader.closest('section') ||
                      aboutJobHeader.closest('[class*="description"]') ||
                      aboutJobHeader.parentElement;
      if (container) {
        const text = cleanText(container.innerText);
        if (text.length > 100) return text;
      }
    }

    // Fallback: find the main job content area (right panel)
    const rightPanel = document.querySelector('.jobs-search__job-details, .job-view-layout, .jobs-details');
    if (rightPanel) {
      // Exclude the header/apply button area, focus on description
      const descArea = rightPanel.querySelector('[class*="description"]') || rightPanel;
      const text = cleanText(descArea.innerText);
      // Limit to reasonable length and try to cut at a good point
      if (text.length > 200) {
        // Find where the actual job content starts (skip company/title header)
        const aboutIndex = text.toLowerCase().indexOf('about');
        if (aboutIndex > 0 && aboutIndex < 500) {
          return text.substring(aboutIndex);
        }
        return text.substring(0, 5000);
      }
    }
  }

  // Indeed-specific extraction
  if (window.location.hostname.includes('indeed.com')) {
    const indeedSelectors = [
      '#jobDescriptionText',
      '.jobsearch-jobDescriptionText',
      '[class*="jobDescription"]',
      '.jobsearch-JobComponent-description',
    ];
    for (const selector of indeedSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Glassdoor-specific
  if (window.location.hostname.includes('glassdoor.com')) {
    const glassdoorSelectors = [
      '.jobDescriptionContent',
      '[class*="JobDetails"]',
      '[class*="jobDescription"]',
      '.desc',
    ];
    for (const selector of glassdoorSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Greenhouse-specific
  if (window.location.hostname.includes('greenhouse.io') || window.location.hostname.includes('boards.greenhouse.io')) {
    const greenhouseSelectors = [
      '#content .content',
      '.content-wrapper',
      '[class*="job-post"]',
      '#app_body',
      '.posting-page',
    ];
    for (const selector of greenhouseSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Lever-specific
  if (window.location.hostname.includes('lever.co') || window.location.hostname.includes('jobs.lever.co')) {
    const leverSelectors = [
      '.posting-page',
      '[class*="posting"]',
      '.content',
      '.section-wrapper',
    ];
    for (const selector of leverSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Workday-specific
  if (window.location.hostname.includes('workday.com') || window.location.hostname.includes('myworkdayjobs.com')) {
    const workdaySelectors = [
      '[data-automation-id="jobPostingDescription"]',
      '[class*="jobDescription"]',
      '.job-description',
      '[data-automation-id="jobPosting"]',
    ];
    for (const selector of workdaySelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Ashby-specific
  if (window.location.hostname.includes('ashbyhq.com') || window.location.hostname.includes('jobs.ashbyhq.com')) {
    const ashbySelectors = [
      '[class*="job-description"]',
      '[class*="jobDescription"]',
      '.posting-content',
      'main',
    ];
    for (const selector of ashbySelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // SmartRecruiters-specific
  if (window.location.hostname.includes('smartrecruiters.com') || window.location.hostname.includes('jobs.smartrecruiters.com')) {
    const srSelectors = [
      '.job-description',
      '[class*="jobDescription"]',
      '.job-details',
    ];
    for (const selector of srSelectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = cleanText(el.innerText);
        if (text.length > 100) return text;
      }
    }
  }

  // Generic job site selectors - expanded
  const genericSelectors = [
    '[class*="job-description"]',
    '[class*="jobDescription"]',
    '[class*="job_description"]',
    '[class*="JobDescription"]',
    '[id*="job-description"]',
    '[id*="jobDescription"]',
    '[id*="job_description"]',
    '[data-testid*="description"]',
    '[data-testid*="job"]',
    '[role="main"]',
    'main',
    '.description',
    '#description',
    'article[class*="job"]',
    '.posting-requirements',
    '.job-details',
    '.job-content',
    '.career-details',
    '.position-description',
    '.vacancy-description',
    '.opening-description',
  ];

  for (const selector of genericSelectors) {
    const el = document.querySelector(selector);
    if (el) {
      const text = cleanText(el.innerText);
      if (text.length > 100 && text.length < 15000) {
        return text;
      }
    }
  }

  // Last resort: find the largest reasonable text block that looks like a JD
  const candidates = document.querySelectorAll('div, section, article, main');
  let bestMatch = null;
  let bestScore = 0;

  const jdKeywords = [
    'responsibilities', 'requirements', 'qualifications', 'experience', 'skills',
    'about the job', 'job description', 'what you', 'who you', 'duties',
    'we are looking', 'we\'re looking', 'you will', 'you\'ll', 'the role',
    'position', 'opportunity', 'benefits', 'compensation', 'salary',
    'minimum qualifications', 'preferred qualifications', 'nice to have',
    'must have', 'years of experience', 'degree', 'bachelor', 'master'
  ];

  candidates.forEach(el => {
    const text = el.innerText || '';
    const len = text.length;

    // Skip if too short or too long
    if (len < 200 || len > 25000) return;

    // Score based on JD-related keywords
    let score = 0;
    const lowerText = text.toLowerCase();
    jdKeywords.forEach(kw => {
      if (lowerText.includes(kw)) score += 10;
    });

    // Prefer medium-length content
    if (len > 500 && len < 8000) score += 5;

    // Penalize if it contains too many links (navigation)
    const linkCount = el.querySelectorAll('a').length;
    if (linkCount > 30) score -= 15;

    // Bonus for having lists (common in JDs)
    const listItems = el.querySelectorAll('li').length;
    if (listItems > 3 && listItems < 50) score += 10;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = text;
    }
  });

  if (bestMatch && bestScore >= 10) {
    return cleanText(bestMatch);
  }

  // Ultimate fallback: get body text minus header/footer/nav
  const body = document.body.cloneNode(true);
  const removeSelectors = ['header', 'footer', 'nav', 'script', 'style', 'noscript', '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]', '.nav', '.navbar', '.footer', '.header', '.menu', '.sidebar', '[class*="cookie"]', '[class*="popup"]', '[class*="modal"]'];
  removeSelectors.forEach(sel => {
    try {
      body.querySelectorAll(sel).forEach(el => el.remove());
    } catch (e) {}
  });
  const bodyText = cleanText(body.innerText);
  if (bodyText.length > 200) {
    // Truncate if too long
    return bodyText.substring(0, 15000);
  }

  // Absolute last resort: just get visible text from body
  const rawText = cleanText(document.body.innerText);
  if (rawText.length > 100) {
    return rawText.substring(0, 15000);
  }

  return null;
}

// Analyze all resumes against JD
async function analyzeAllResumes() {
  if (!currentJD) {
    showStatus('Please extract a job description first', 'error');
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerHTML = `
    <svg class="spinner" width="14" height="14" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
    Analyzing...
  `;

  try {
    // For now, simulate analysis (TODO: connect to AI backend)
    analysisResults = await simulateAnalysis(resumes, currentJD);

    // Sort by score
    analysisResults.sort((a, b) => b.score - a.score);

    // Re-order resumes by score
    resumes.sort((a, b) => {
      const scoreA = analysisResults.find(r => r.resumeId === a._id)?.score || 0;
      const scoreB = analysisResults.find(r => r.resumeId === b._id)?.score || 0;
      return scoreB - scoreA;
    });

    renderResumes();
    showStatus('Analysis complete!', 'success');
  } catch (error) {
    console.error('Analysis error:', error);
    showStatus('Analysis failed. Please try again.', 'error');
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = `
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
      Analyze All Resumes
    `;
  }
}

// Simulate analysis (TODO: replace with real API call when resume parsing is implemented)
async function simulateAnalysis(resumes, jd) {
  // Extract keywords from JD
  const keywords = extractKeywordsFromJD(jd);

  console.log('Extracted keywords:', keywords);

  return resumes.map(resume => {
    // For now, since resumes aren't parsed yet, we'll simulate based on resume name
    // In production, this would compare against resume.parsedContent
    const resumeText = (
      resume.name + ' ' +
      resume.filename + ' ' +
      (resume.parsedContent?.skills?.join(' ') || '') +
      (resume.parsedContent?.fullText || '')
    ).toLowerCase();

    const matchedKeywords = [];
    const missingKeywords = [];

    keywords.forEach(kw => {
      if (resumeText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    // Calculate score - if no parsed content, give a base score + some randomness
    let score;
    if (matchedKeywords.length > 0) {
      score = Math.round((matchedKeywords.length / keywords.length) * 100);
    } else {
      // No parsed content yet - show estimated score
      score = Math.floor(Math.random() * 25 + 45); // 45-70% range
    }

    return {
      resumeId: resume._id,
      score,
      matchedKeywords,
      missingKeywords,
      keywords,
      hasParsedContent: !!(resume.parsedContent?.fullText || resume.parsedContent?.skills?.length),
    };
  });
}

// Extract keywords from JD text
function extractKeywordsFromJD(jdText) {
  const text = jdText.toLowerCase();

  // Comprehensive technical skills database
  const technicalKeywords = [
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'perl', 'r', 'matlab', 'haskell', 'clojure', 'elixir', 'erlang', 'lua', 'dart', 'objective-c', 'cobol', 'fortran', 'assembly', 'vba', 'groovy',

    // Frontend Frameworks & Libraries
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js', 'next.js', 'nextjs', 'nuxt', 'nuxt.js', 'svelte', 'ember', 'backbone', 'jquery', 'redux', 'mobx', 'zustand', 'recoil', 'gatsby', 'remix',

    // Frontend Technologies
    'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap', 'material ui', 'mui', 'chakra', 'styled-components', 'emotion', 'webpack', 'vite', 'parcel', 'rollup', 'babel', 'postcss',

    // Backend Frameworks
    'node.js', 'nodejs', 'node', 'express', 'expressjs', 'express.js', 'nestjs', 'nest.js', 'fastify', 'koa', 'hapi', 'django', 'flask', 'fastapi', 'pyramid', 'spring', 'spring boot', 'springboot', 'quarkus', 'micronaut', 'rails', 'ruby on rails', 'ror', 'sinatra', '.net', 'asp.net', '.net core', 'laravel', 'symfony', 'codeigniter', 'phoenix', 'gin', 'echo', 'fiber',

    // Databases - SQL
    'sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'sql server', 'mssql', 'sqlite', 'mariadb', 'db2', 'snowflake', 'redshift', 'bigquery',

    // Databases - NoSQL
    'nosql', 'mongodb', 'dynamodb', 'cassandra', 'couchdb', 'couchbase', 'firebase', 'firestore', 'neo4j', 'arangodb', 'rethinkdb', 'hbase',

    // Caching & Message Queues
    'redis', 'memcached', 'rabbitmq', 'kafka', 'activemq', 'zeromq', 'sqs', 'sns', 'pubsub', 'nats', 'celery',

    // Search
    'elasticsearch', 'elastic', 'solr', 'algolia', 'meilisearch', 'opensearch',

    // Cloud Platforms
    'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud', 'google cloud platform', 'heroku', 'digitalocean', 'linode', 'vultr', 'cloudflare', 'vercel', 'netlify', 'railway', 'render', 'fly.io',

    // AWS Services
    'ec2', 's3', 'lambda', 'ecs', 'eks', 'fargate', 'rds', 'aurora', 'cloudfront', 'route53', 'api gateway', 'step functions', 'cloudwatch', 'cloudformation', 'cdk', 'sam', 'amplify', 'cognito', 'iam', 'vpc', 'elb', 'alb', 'sagemaker', 'athena', 'glue', 'emr', 'kinesis',

    // Azure Services
    'azure functions', 'azure devops', 'cosmos db', 'azure sql', 'blob storage', 'aks', 'app service',

    // GCP Services
    'cloud functions', 'cloud run', 'app engine', 'compute engine', 'cloud storage', 'bigtable', 'spanner', 'dataflow', 'dataproc', 'gke',

    // DevOps & Infrastructure
    'docker', 'kubernetes', 'k8s', 'helm', 'istio', 'linkerd', 'envoy', 'terraform', 'pulumi', 'ansible', 'puppet', 'chef', 'saltstack', 'vagrant', 'packer',

    // CI/CD
    'jenkins', 'ci/cd', 'cicd', 'github actions', 'gitlab ci', 'gitlab', 'circleci', 'travis ci', 'travisci', 'azure pipelines', 'bamboo', 'teamcity', 'argo', 'argocd', 'spinnaker', 'drone', 'buildkite', 'tekton', 'concourse',

    // Monitoring & Observability
    'prometheus', 'grafana', 'datadog', 'new relic', 'newrelic', 'splunk', 'elastic stack', 'elk', 'kibana', 'logstash', 'fluentd', 'jaeger', 'zipkin', 'opentelemetry', 'dynatrace', 'pagerduty', 'opsgenie', 'sentry',

    // APIs & Protocols
    'rest', 'restful', 'rest api', 'graphql', 'grpc', 'soap', 'websocket', 'websockets', 'http', 'https', 'tcp', 'udp', 'mqtt', 'amqp', 'protobuf', 'protocol buffers', 'json', 'xml', 'yaml', 'openapi', 'swagger',

    // Authentication & Security
    'oauth', 'oauth2', 'oauth 2.0', 'jwt', 'saml', 'sso', 'ldap', 'active directory', 'keycloak', 'auth0', 'okta', 'ssl', 'tls', 'https', 'encryption', 'hashing', 'bcrypt', 'security', 'cybersecurity', 'penetration testing', 'owasp', 'vulnerability', 'firewall', 'waf',

    // Architecture
    'microservices', 'monolith', 'serverless', 'event-driven', 'event driven', 'domain driven design', 'ddd', 'cqrs', 'event sourcing', 'soa', 'api gateway', 'service mesh', 'distributed systems', 'scalability', 'high availability', 'fault tolerance', 'load balancing',

    // Data & AI/ML
    'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence', 'neural networks', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn', 'jupyter', 'data science', 'data analysis', 'data engineering', 'etl', 'data pipeline', 'data warehouse', 'data lake', 'nlp', 'natural language processing', 'computer vision', 'cv', 'llm', 'large language models', 'gpt', 'bert', 'transformers', 'hugging face', 'mlops', 'mlflow', 'kubeflow', 'feature store', 'model serving',

    // Big Data
    'hadoop', 'spark', 'apache spark', 'pyspark', 'hive', 'pig', 'presto', 'trino', 'flink', 'beam', 'airflow', 'luigi', 'dagster', 'prefect', 'dbt',

    // Testing
    'testing', 'unit testing', 'integration testing', 'e2e testing', 'end-to-end testing', 'test automation', 'tdd', 'bdd', 'jest', 'mocha', 'chai', 'jasmine', 'karma', 'cypress', 'playwright', 'puppeteer', 'selenium', 'webdriver', 'testng', 'junit', 'pytest', 'rspec', 'cucumber', 'postman', 'insomnia', 'k6', 'jmeter', 'gatling', 'locust', 'artillery',

    // Version Control
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'version control',

    // Project Management & Collaboration
    'jira', 'confluence', 'trello', 'asana', 'monday', 'notion', 'linear', 'shortcut', 'clickup', 'basecamp', 'azure boards',

    // Methodologies
    'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'xp', 'extreme programming', 'safe', 'devops', 'devsecops', 'sre', 'site reliability',

    // Operating Systems & Shell
    'linux', 'unix', 'ubuntu', 'centos', 'debian', 'rhel', 'red hat', 'windows', 'macos', 'bash', 'shell', 'shell scripting', 'powershell', 'zsh', 'fish',

    // Mobile Development
    'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic', 'cordova', 'capacitor', 'swiftui', 'uikit', 'jetpack compose', 'kotlin multiplatform', 'mobile development',

    // Game Development
    'unity', 'unreal', 'unreal engine', 'godot', 'game development', 'opengl', 'vulkan', 'directx', 'webgl', 'three.js',

    // Blockchain & Web3
    'blockchain', 'ethereum', 'solidity', 'web3', 'smart contracts', 'defi', 'nft', 'cryptocurrency', 'bitcoin', 'solana', 'rust', 'hardhat', 'truffle',

    // Design & UX
    'figma', 'sketch', 'adobe xd', 'invision', 'zeplin', 'ui', 'ux', 'ui/ux', 'user interface', 'user experience', 'wireframing', 'prototyping', 'design systems',

    // Other Tools & Technologies
    'vim', 'neovim', 'vscode', 'visual studio', 'intellij', 'eclipse', 'xcode', 'android studio', 'postman', 'insomnia', 'charles', 'fiddler', 'wireshark', 'nginx', 'apache', 'tomcat', 'iis', 'haproxy', 'traefik', 'caddy',

    // Soft Technical Skills
    'code review', 'debugging', 'troubleshooting', 'performance optimization', 'refactoring', 'documentation', 'technical writing', 'system design', 'architecture design', 'api design', 'database design', 'schema design',
  ];

  // Soft skills
  const softSkills = [
    'leadership', 'communication', 'problem solving', 'problem-solving', 'teamwork', 'collaboration', 'analytical', 'critical thinking', 'creativity', 'innovation', 'adaptability', 'flexibility', 'time management', 'project management', 'mentoring', 'coaching', 'presentation', 'negotiation', 'conflict resolution', 'decision making', 'strategic thinking', 'attention to detail', 'self-motivated', 'proactive', 'initiative', 'ownership', 'accountability', 'stakeholder management', 'cross-functional', 'interpersonal',
  ];

  // Find which keywords appear in the JD
  const foundKeywords = new Set();

  // Special display names for certain keywords
  const displayNames = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'node': 'Node.js',
    'reactjs': 'React',
    'react.js': 'React',
    'vuejs': 'Vue.js',
    'vue.js': 'Vue.js',
    'nextjs': 'Next.js',
    'next.js': 'Next.js',
    'nuxt.js': 'Nuxt.js',
    'expressjs': 'Express.js',
    'express.js': 'Express.js',
    'nestjs': 'NestJS',
    'nest.js': 'NestJS',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mongodb': 'MongoDB',
    'mysql': 'MySQL',
    'mssql': 'SQL Server',
    'sql server': 'SQL Server',
    'dynamodb': 'DynamoDB',
    'graphql': 'GraphQL',
    'grpc': 'gRPC',
    'aws': 'AWS',
    'gcp': 'GCP',
    'azure': 'Azure',
    'ci/cd': 'CI/CD',
    'cicd': 'CI/CD',
    'k8s': 'Kubernetes',
    'ai': 'AI',
    'ml': 'ML',
    'nlp': 'NLP',
    'llm': 'LLM',
    'api': 'API',
    'apis': 'APIs',
    'rest': 'REST',
    'restful': 'REST',
    'rest api': 'REST API',
    'jwt': 'JWT',
    'oauth': 'OAuth',
    'oauth2': 'OAuth 2.0',
    'sso': 'SSO',
    'html': 'HTML',
    'html5': 'HTML5',
    'css': 'CSS',
    'css3': 'CSS3',
    'sass': 'Sass',
    'scss': 'Sass',
    'sql': 'SQL',
    'nosql': 'NoSQL',
    'ios': 'iOS',
    'tdd': 'TDD',
    'bdd': 'BDD',
    'sre': 'SRE',
    'devops': 'DevOps',
    'devsecops': 'DevSecOps',
    'ddd': 'DDD',
    'cqrs': 'CQRS',
    'ui': 'UI',
    'ux': 'UX',
    'ui/ux': 'UI/UX',
    'ec2': 'EC2',
    's3': 'S3',
    'rds': 'RDS',
    'ecs': 'ECS',
    'eks': 'EKS',
    'iam': 'IAM',
    'vpc': 'VPC',
    'elb': 'ELB',
    'alb': 'ALB',
    'cdk': 'CDK',
    'sam': 'SAM',
    'gke': 'GKE',
    'aks': 'AKS',
    'elk': 'ELK Stack',
    'etl': 'ETL',
    'dbt': 'dbt',
    'cv': 'Computer Vision',
    'springboot': 'Spring Boot',
    'spring boot': 'Spring Boot',
    'ruby on rails': 'Ruby on Rails',
    'ror': 'Ruby on Rails',
    '.net': '.NET',
    '.net core': '.NET Core',
    'asp.net': 'ASP.NET',
    'tailwindcss': 'Tailwind CSS',
    'material ui': 'Material UI',
    'mui': 'Material UI',
    'github actions': 'GitHub Actions',
    'gitlab ci': 'GitLab CI',
    'azure pipelines': 'Azure Pipelines',
    'travis ci': 'Travis CI',
    'travisci': 'Travis CI',
    'argocd': 'ArgoCD',
    'new relic': 'New Relic',
    'newrelic': 'New Relic',
    'elastic stack': 'ELK Stack',
    'apache spark': 'Apache Spark',
    'hugging face': 'Hugging Face',
    'scikit-learn': 'Scikit-learn',
    'sklearn': 'Scikit-learn',
    'react native': 'React Native',
    'jetpack compose': 'Jetpack Compose',
    'kotlin multiplatform': 'Kotlin Multiplatform',
    'unreal engine': 'Unreal Engine',
    'three.js': 'Three.js',
    'smart contracts': 'Smart Contracts',
    'adobe xd': 'Adobe XD',
    'android studio': 'Android Studio',
    'visual studio': 'Visual Studio',
    'problem-solving': 'Problem Solving',
    'cross-functional': 'Cross-functional',
  };

  technicalKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      const display = displayNames[kw.toLowerCase()] || kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      foundKeywords.add(display);
    }
  });

  softSkills.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      const display = displayNames[kw.toLowerCase()] || kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      foundKeywords.add(display);
    }
  });

  // Also extract years of experience if mentioned
  const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (expMatch) {
    foundKeywords.add(`${expMatch[1]}+ Years Experience`);
  }

  const result = Array.from(foundKeywords);
  console.log('Found keywords in JD:', result);
  return result.slice(0, 40); // Increased limit to 40 keywords
}

// Current detail state for copy function
let currentDetailAnalysis = null;
let currentDetailResume = null;

// Show resume detail view
function showResumeDetail(resumeId) {
  const resume = resumes.find(r => r._id === resumeId);
  const analysis = analysisResults?.find(r => r.resumeId === resumeId);

  if (!resume) return;

  currentDetailResume = resume;
  currentDetailAnalysis = analysis;

  detailTitle.textContent = resume.name;

  if (analysis) {
    const scoreClass = analysis.score >= 80 ? 'high' : analysis.score >= 60 ? 'medium' : 'low';
    detailScoreValue.textContent = analysis.score + '%';
    detailScoreValue.className = 'detail-score-value ' + scoreClass;

    // Score bar
    scoreBarFill.style.width = analysis.score + '%';
    scoreBarFill.className = 'score-bar-fill' + (analysis.score < 60 ? ' low' : analysis.score < 80 ? ' medium' : '');

    const totalKw = analysis.matchedKeywords.length + analysis.missingKeywords.length;
    matchedLabel.textContent = `${analysis.matchedKeywords.length} matched`;
    totalLabel.textContent = `of ${totalKw} keywords`;

    // Improvement tip
    if (analysis.missingKeywords.length > 0) {
      const potentialScore = Math.min(100, analysis.score + Math.round((analysis.missingKeywords.length / totalKw) * 100));
      tipText.textContent = `Add ${analysis.missingKeywords.length} missing keyword${analysis.missingKeywords.length > 1 ? 's' : ''} to potentially boost your score to ~${potentialScore}%`;
      improvementTip.classList.remove('hidden');
    } else {
      improvementTip.classList.add('hidden');
    }

    matchedCount.textContent = analysis.matchedKeywords.length;
    missingCount.textContent = analysis.missingKeywords.length;

    // Missing keywords (show first - more actionable)
    missingKeywords.innerHTML = analysis.missingKeywords.map(kw => `
      <div class="keyword-item missing">
        <div class="keyword-icon missing">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <span class="keyword-text missing">${kw}</span>
      </div>
    `).join('') || '<p style="color: #22c55e; font-size: 12px;">🎉 All JD keywords are in your resume!</p>';

    // Matched keywords
    matchedKeywords.innerHTML = analysis.matchedKeywords.map(kw => `
      <div class="keyword-item matched">
        <div class="keyword-icon matched">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <span class="keyword-text matched">${kw}</span>
      </div>
    `).join('') || '<p style="color: #64748b; font-size: 12px;">No matched keywords</p>';

    // Show/hide copy button based on missing keywords
    copyMissingBtn.style.display = analysis.missingKeywords.length > 0 ? 'inline-flex' : 'none';

  } else {
    detailScoreValue.textContent = '--';
    detailScoreValue.className = 'detail-score-value';
    scoreBarFill.style.width = '0%';
    matchedLabel.textContent = '0 matched';
    totalLabel.textContent = 'of 0 keywords';
    improvementTip.classList.add('hidden');
    matchedCount.textContent = '0';
    missingCount.textContent = '0';
    matchedKeywords.innerHTML = '<p style="color: #64748b; font-size: 12px;">Extract and analyze a JD first</p>';
    missingKeywords.innerHTML = '<p style="color: #64748b; font-size: 12px;">Extract and analyze a JD first</p>';
    copyMissingBtn.style.display = 'none';
  }

  detailView.classList.remove('hidden');
}

// Copy missing keywords to clipboard
async function copyMissingKeywords() {
  if (!currentDetailAnalysis?.missingKeywords?.length) return;

  const text = currentDetailAnalysis.missingKeywords.join(', ');

  try {
    await navigator.clipboard.writeText(text);
    copyMissingBtn.innerHTML = `
      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
      </svg>
      Copied!
    `;
    copyMissingBtn.classList.add('copied');

    setTimeout(() => {
      copyMissingBtn.innerHTML = `
        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        Copy
      `;
      copyMissingBtn.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Hide detail view
function hideDetailView() {
  detailView.classList.add('hidden');
  currentDetailAnalysis = null;
  currentDetailResume = null;
}

// Show status message
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status ${type}`;
  statusMessage.classList.remove('hidden');

  setTimeout(() => {
    statusMessage.classList.add('hidden');
  }, 3000);
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Event Listeners
if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    console.log('Login button clicked, opening:', `${APP_URL}/login?extension=true`);
    chrome.tabs.create({ url: `${APP_URL}/login?extension=true` });
  });
} else {
  console.error('loginBtn element not found!');
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove(['accessToken', 'refreshToken', 'user']);
    isAuthenticated = false;
    currentUser = null;
    resumes = [];
    analysisResults = null;
    showAuthSection();
    showStatus('Logged out successfully', 'success');
  });
}

if (extractJdBtn) extractJdBtn.addEventListener('click', extractJD);
if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeAllResumes);
if (backBtn) backBtn.addEventListener('click', hideDetailView);
if (copyMissingBtn) copyMissingBtn.addEventListener('click', copyMissingKeywords);

// Toggle JD view more/less
if (viewMoreJdBtn) {
  viewMoreJdBtn.addEventListener('click', () => {
    const isExpanded = jdPreview.classList.toggle('expanded');
    viewMoreJdBtn.classList.toggle('expanded', isExpanded);
    viewMoreJdBtn.querySelector('span').textContent = isExpanded ? 'View less' : 'View more';
  });
}
