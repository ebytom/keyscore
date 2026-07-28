# AI Job Copilot - Chrome Extension

A Chrome extension that extracts job postings from LinkedIn, Indeed, Wellfound, Greenhouse, and Lever, then syncs them with your AI Job Copilot dashboard.

## Features

- **One-click job extraction** from supported job boards
- **ATS score preview** before saving
- **Quick save** to your job tracker
- **Sync with dashboard** for full analysis

## Supported Platforms

| Platform | Support |
|----------|---------|
| LinkedIn Jobs | ✅ Full |
| Indeed | ✅ Full |
| Wellfound (AngelList) | ✅ Full |
| Greenhouse | ✅ Full |
| Lever | ✅ Full |

## Installation

### Development Mode

1. **Generate Icons** (required):
   ```bash
   cd packages/extension
   node scripts/generate-icons.js
   ```
   Or manually create PNG icons (16x16, 32x32, 48x48, 128x128) in the `icons/` folder.

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the `packages/extension` folder

3. **Configure API URL**:
   - Click the extension icon
   - Sign in with your AI Job Copilot account
   - The extension will automatically connect to your local dev server

### Production Build

```bash
# From project root
pnpm build:extension
```

This creates a `dist/extension` folder ready for Chrome Web Store submission.

## Usage

1. Navigate to a job posting on a supported platform
2. The AI Job Copilot button appears in the bottom-right corner
3. Click to see job details and ATS match score
4. Click "Save Job" to add to your tracker
5. View all saved jobs in your [Dashboard](http://localhost:3000/dashboard)

## Project Structure

```
extension/
├── manifest.json          # Extension manifest (V3)
├── background.js          # Service worker for API calls
├── popup.html             # Extension popup UI
├── popup.js               # Popup functionality
├── content-scripts/
│   ├── styles.css         # Injected styles
│   ├── linkedin.js        # LinkedIn job extractor
│   ├── indeed.js          # Indeed job extractor
│   ├── wellfound.js       # Wellfound job extractor
│   ├── greenhouse.js      # Greenhouse job extractor
│   └── lever.js           # Lever job extractor
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## API Integration

The extension communicates with the backend API at `http://localhost:4000/api`:

- `POST /api/auth/login` - User authentication
- `POST /api/jobs` - Save extracted job
- `POST /api/ai/ats-score` - Get ATS match score
- `GET /api/jobs` - Fetch saved jobs

## Development

The extension uses vanilla JavaScript (no build step required) for simplicity and fast iteration.

To test changes:
1. Make your edits
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on a job posting page
