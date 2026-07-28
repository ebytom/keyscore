// KeyScore - Indeed Content Script

(function() {
  'use strict';

  if (window.aiJobCopilotIndeed) return;
  window.aiJobCopilotIndeed = true;

  let currentJobData = null;
  let saveButton = null;

  function init() {
    const observer = new MutationObserver(() => {
      if (isJobPage()) {
        extractJobData();
        injectSaveButton();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (isJobPage()) {
      setTimeout(() => {
        extractJobData();
        injectSaveButton();
      }, 1000);
    }
  }

  function isJobPage() {
    return window.location.href.includes('/viewjob') ||
           window.location.href.includes('vjk=') ||
           document.querySelector('.jobsearch-ViewJobLayout');
  }

  function extractJobData() {
    try {
      // Title
      const titleEl = document.querySelector('.jobsearch-JobInfoHeader-title, h1[data-testid="jobsearch-JobInfoHeader-title"], .icl-u-xs-mb--xs');
      const title = titleEl?.textContent?.trim() || '';

      // Company
      const companyEl = document.querySelector('.jobsearch-InlineCompanyRating-companyHeader a, [data-testid="inlineHeader-companyName"], .icl-u-lg-mr--sm');
      const company = companyEl?.textContent?.trim() || '';

      // Location
      const locationEl = document.querySelector('.jobsearch-JobInfoHeader-subtitle .css-6z8o9s, [data-testid="job-location"], .icl-u-xs-mt--xs');
      const location = locationEl?.textContent?.trim() || '';

      // Salary
      const salaryEl = document.querySelector('[data-testid="attribute_snippet_testid"] span, .jobsearch-JobMetadataHeader-item');
      const salaryText = salaryEl?.textContent?.trim() || '';

      // Description
      const descEl = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');
      const description = descEl?.textContent?.trim() || '';

      // Job type
      const type = extractJobType(description + ' ' + salaryText);

      // Skills from description
      const skills = extractSkillsFromDescription(description);
      const requirements = extractRequirements(description);

      currentJobData = {
        title,
        company,
        location,
        type,
        description,
        skills,
        requirements,
        source: 'indeed',
        sourceUrl: window.location.href,
        postedAt: new Date().toISOString(),
      };

      console.log('KeyScore: Job data extracted', currentJobData);
    } catch (error) {
      console.error('KeyScore: Error extracting job data', error);
    }
  }

  function extractJobType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('contract')) return 'contract';
    if (lower.includes('part-time') || lower.includes('part time')) return 'part-time';
    if (lower.includes('internship') || lower.includes('intern')) return 'internship';
    return 'full-time';
  }

  function extractRequirements(description) {
    const requirements = [];
    const lines = description.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if ((trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.match(/^\d+\./)) && trimmed.length > 10) {
        requirements.push(trimmed.replace(/^[•\-\d.]+\s*/, ''));
        if (requirements.length >= 10) break;
      }
    }

    return requirements;
  }

  function extractSkillsFromDescription(description) {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'REST', 'GraphQL', 'Microservices', 'Git', 'Linux',
      'Machine Learning', 'AI', 'Data Science',
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

  async function handleSaveClick() {
    if (!currentJobData || !currentJobData.title) {
      showToast('Could not extract job data', 'error');
      return;
    }

    saveButton.classList.add('saving');
    saveButton.textContent = 'Saving...';

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
        showToast('Job saved!', 'success');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      saveButton.classList.remove('saving');
      saveButton.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
        Save to KeyScore
      `;
      showToast(error.message || 'Failed to save', 'error');
    }
  }

  function showToast(message, type) {
    const existing = document.querySelector('.keyscore-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `keyscore-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'EXTRACT_JOB') {
      extractJobData();
      sendResponse({ success: !!currentJobData?.title, data: currentJobData });
    }
    return true;
  });

  init();
})();
