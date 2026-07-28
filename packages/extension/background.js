// KeyScore - Background Service Worker

const API_BASE_URL = 'http://localhost:4000/api';
const APP_URL = 'http://localhost:3000';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse);
  return true; // Keep message channel open for async response
});

// Listen for tab updates to detect successful login and close the tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check when URL changes or page completes loading
  if (changeInfo.url?.includes('/extension-success') ||
      (changeInfo.status === 'complete' && tab.url?.includes('/extension-success'))) {
    console.log('Extension success page detected, closing tab in 2.5s');
    // Success page loaded - wait then close
    setTimeout(async () => {
      try {
        await chrome.tabs.remove(tabId);
        console.log('Tab closed successfully');
      } catch (e) {
        console.log('Could not close tab:', e);
      }
    }, 2500);
  }
});

async function handleMessage(message, sender) {
  switch (message.type) {
    case 'GET_AUTH_STATUS':
      return await getAuthStatus();
    case 'GET_RESUMES':
      return await getResumes();
    case 'ANALYZE_JD':
      return await analyzeJD(message.data);
    case 'COMPARE_RESUME':
      return await compareResumeWithJD(message.data);
    default:
      return { success: false, error: 'Unknown message type' };
  }
}

// Get stored auth token
async function getAuthToken() {
  const result = await chrome.storage.local.get(['accessToken']);
  return result.accessToken;
}

// Refresh the access token using refresh token
async function refreshAccessToken() {
  const result = await chrome.storage.local.get(['refreshToken']);
  const refreshToken = result.refreshToken;

  if (!refreshToken) {
    console.log('No refresh token available');
    return null;
  }

  try {
    console.log('Attempting to refresh access token...');
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token refreshed successfully');

      // Store new tokens
      await chrome.storage.local.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      return data.accessToken;
    } else {
      console.log('Token refresh failed:', response.status);
      // Clear invalid tokens
      await chrome.storage.local.remove(['accessToken', 'refreshToken', 'user']);
      return null;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

// Check authentication status with auto-refresh
async function getAuthStatus() {
  let token = await getAuthToken();
  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    let response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // If token expired (401), try to refresh
    if (response.status === 401) {
      console.log('Access token expired, attempting refresh...');
      token = await refreshAccessToken();

      if (token) {
        // Retry with new token
        response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        return { isAuthenticated: false };
      }
    }

    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, user: data.user };
    } else {
      await chrome.storage.local.remove(['accessToken', 'refreshToken', 'user']);
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    return { isAuthenticated: false, error: error.message };
  }
}

// Helper function to make authenticated API requests with auto-refresh
async function authenticatedFetch(url, options = {}) {
  let token = await getAuthToken();
  if (!token) {
    return { response: null, error: 'Not authenticated' };
  }

  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  let response = await fetch(url, fetchOptions);

  // If token expired (401), try to refresh and retry
  if (response.status === 401) {
    console.log('Token expired during API call, refreshing...');
    token = await refreshAccessToken();

    if (token) {
      fetchOptions.headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(url, fetchOptions);
    } else {
      return { response: null, error: 'Session expired. Please sign in again.' };
    }
  }

  return { response, error: null };
}

// Get user's resumes
async function getResumes() {
  try {
    const { response, error } = await authenticatedFetch(`${API_BASE_URL}/resumes`);

    if (error) {
      return { success: false, error };
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Get resumes failed:', error);
    return { success: false, error: error.message };
  }
}

// Analyze JD and compare with all resumes
async function analyzeJD(jobDescription) {
  try {
    const { response, error } = await authenticatedFetch(`${API_BASE_URL}/ai/analyze-jd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription }),
    });

    if (error) {
      return { success: false, error };
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Analyze JD failed:', error);
    return { success: false, error: error.message };
  }
}

// Compare a specific resume with JD
async function compareResumeWithJD({ resumeId, jobDescription }) {
  try {
    const { response, error } = await authenticatedFetch(`${API_BASE_URL}/ai/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeId, jobDescription }),
    });

    if (error) {
      return { success: false, error };
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Compare failed:', error);
    return { success: false, error: error.message };
  }
}
