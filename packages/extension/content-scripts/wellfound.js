// KeyScore - Wellfound/AngelList Content Script

(function() {
  'use strict';

  if (window.aiJobCopilotWellfound) return;
  window.aiJobCopilotWellfound = true;

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
    return window.location.href.includes('/jobs/') ||
           window.location.href.includes('/company/') && document.querySelector('[data-test="JobListing"]');
  }

  function extractJobData() {
    try {
      // Title
      const titleEl = document.querySelector('h1[data-test="JobTitle"], h1, .styles_title__');
      const title = titleEl?.textContent?.trim() || '';

      // Company
      const companyEl = document.querySelector('[data-test="CompanyName"] a, .styles_startup__');
      const company = companyEl?.textContent?.trim() || '';

      // Location
      const locationEl = document.querySelector('[data-test="Location"], .styles_location__');
      const location = locationEl?.textContent?.trim() || '';

      // Salary
      const salaryEl = document.querySelector('[data-test="Compensation"], .styles_compensation__');
      const salary = salaryEl?.textContent?.trim() || '';

      // Description
      const descEl = document.querySelector('[data-test="JobDescription"], .styles_description__');
      const description = descEl?.textContent?.trim() || '';

      // Job type
      const typeEl = document.querySelector('[data-test="JobType"], .styles_jobType__');
      const type = extractJobType(typeEl?.textContent || description);

      // Skills
      const skillsEls = document.querySelectorAll('[data-test="Skill"], .styles_skill__');
      const skills = Array.from(skillsEls).map(el => el.textContent?.trim()).filter(Boolean);

      const requirements = extractRequirements(description);

      currentJobData = {
        title,
        company,
        location,
        type,
        description,
        skills: skills.length > 0 ? skills : extractSkillsFromDescription(description),
        requirements,
        source: 'wellfound',
        sourceUrl: window.location.href,
        postedAt: new Date().toISOString(),
      };

      if (salary) {
        currentJobData.salary = { currency: 'USD', min: 0, max: 0 };
      }

      console.log('KeyScore: Job data extracted', currentJobData);
    } catch (error) {
      console.error('KeyScore: Error extracting job data', error);
    }
  }

  function extractJobType(text) {
    const lower = text.toLowerCase();
    if (lower.includes('remote')) return 'remote';
    if (lower.includes('contract')) return 'contract';
    if (lower.includes('part-time')) return 'part-time';
    if (lower.includes('internship')) return 'internship';
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
