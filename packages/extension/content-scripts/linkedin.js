// KeyScore - LinkedIn Content Script

(function() {
  'use strict';

  // Prevent multiple injections
  if (window.aiJobCopilotLinkedIn) return;
  window.aiJobCopilotLinkedIn = true;

  let currentJobData = null;
  let saveButton = null;

  // Initialize
  function init() {
    // Wait for job details to load
    const observer = new MutationObserver(() => {
      if (isJobPage()) {
        extractJobData();
        injectSaveButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial check
    if (isJobPage()) {
      setTimeout(() => {
        extractJobData();
        injectSaveButton();
      }, 1000);
    }
  }

  // Check if on a job page
  function isJobPage() {
    return window.location.href.includes('/jobs/view/') ||
           window.location.href.includes('/jobs/search/') ||
           document.querySelector('.jobs-details');
  }

  // Extract job data from LinkedIn
  function extractJobData() {
    try {
      const jobDetails = document.querySelector('.jobs-details, .job-view-layout');
      if (!jobDetails) return;

      // Title
      const titleEl = jobDetails.querySelector('.job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1');
      const title = titleEl?.textContent?.trim() || '';

      // Company
      const companyEl = jobDetails.querySelector('.job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, a[data-tracking-control-name="public_jobs_topcard-org-name"]');
      const company = companyEl?.textContent?.trim() || '';

      // Location
      const locationEl = jobDetails.querySelector('.job-details-jobs-unified-top-card__primary-description-container, .jobs-unified-top-card__bullet, .jobs-unified-top-card__subtitle-primary-grouping span');
      const location = locationEl?.textContent?.trim().split('·')[0]?.trim() || '';

      // Job type
      const typeEl = jobDetails.querySelector('.job-details-jobs-unified-top-card__job-insight span, .jobs-unified-top-card__workplace-type');
      const type = extractJobType(typeEl?.textContent || '');

      // Description
      const descEl = jobDetails.querySelector('.jobs-description-content__text, .jobs-box__html-content, .description__text');
      const description = descEl?.textContent?.trim() || '';

      // Skills
      const skillsEls = jobDetails.querySelectorAll('.job-details-how-you-match__skills-item, .jobs-ppc-criteria__skill span');
      const skills = Array.from(skillsEls).map(el => el.textContent?.trim()).filter(Boolean);

      // Requirements (from description)
      const requirements = extractRequirements(description);

      currentJobData = {
        title,
        company,
        location,
        type,
        description,
        skills: skills.length > 0 ? skills : extractSkillsFromDescription(description),
        requirements,
        source: 'linkedin',
        sourceUrl: window.location.href,
        postedAt: extractPostedDate(),
      };

      console.log('KeyScore: Job data extracted', currentJobData);
    } catch (error) {
      console.error('KeyScore: Error extracting job data', error);
    }
  }

  // Extract job type
  function extractJobType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('contract')) return 'contract';
    if (lower.includes('part-time')) return 'part-time';
    if (lower.includes('internship')) return 'internship';
    return 'full-time';
  }

  // Extract requirements from description
  function extractRequirements(description) {
    const requirements = [];
    const lines = description.split('\n');

    let inRequirementsSection = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('requirement') || trimmed.toLowerCase().includes('qualifications')) {
        inRequirementsSection = true;
        continue;
      }
      if (inRequirementsSection && trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        requirements.push(trimmed.replace(/^[•\-\d.]+\s*/, ''));
      }
      if (requirements.length > 10) break;
    }

    return requirements;
  }

  // Extract skills from description
  function extractSkillsFromDescription(description) {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Rails',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'REST', 'GraphQL', 'gRPC', 'Microservices',
      'Agile', 'Scrum', 'Git', 'Linux',
      'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch',
    ];

    const foundSkills = [];
    const lowerDesc = description.toLowerCase();

    for (const skill of commonSkills) {
      if (lowerDesc.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }

    return foundSkills.slice(0, 15);
  }

  // Extract posted date
  function extractPostedDate() {
    const postedEl = document.querySelector('.job-details-jobs-unified-top-card__primary-description-container time, .jobs-unified-top-card__posted-date');
    if (postedEl) {
      const dateAttr = postedEl.getAttribute('datetime');
      if (dateAttr) return new Date(dateAttr).toISOString();
    }
    return new Date().toISOString();
  }

  // Inject save button
  function injectSaveButton() {
    if (saveButton && document.body.contains(saveButton)) return;

    saveButton = document.createElement('button');
    saveButton.className = 'keyscore-btn';
    saveButton.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      Save to KeyScore
    `;

    saveButton.addEventListener('click', handleSaveClick);
    document.body.appendChild(saveButton);
  }

  // Handle save button click
  async function handleSaveClick() {
    if (!currentJobData || !currentJobData.title) {
      showToast('Could not extract job data. Please refresh the page.', 'error');
      return;
    }

    saveButton.classList.add('saving');
    saveButton.innerHTML = `
      <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Saving...
    `;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SAVE_JOB',
        data: currentJobData,
      });

      if (response.success) {
        saveButton.classList.remove('saving');
        saveButton.classList.add('saved');
        saveButton.innerHTML = `
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Saved!
        `;
        showToast('Job saved to KeyScore!', 'success');
      } else {
        throw new Error(response.error || 'Failed to save job');
      }
    } catch (error) {
      saveButton.classList.remove('saving');
      saveButton.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
        Save to KeyScore
      `;
      showToast(error.message || 'Failed to save job', 'error');
    }
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.keyscore-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `keyscore-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACT_JOB') {
      extractJobData();
      sendResponse({
        success: !!currentJobData?.title,
        data: currentJobData,
      });
    }
    return true;
  });

  // Initialize
  init();
})();
