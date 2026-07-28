# KeyScore

<div align="center">

![KeyScore](https://img.shields.io/badge/KeyScore-ATS%20Resume%20Checker-6366f1?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-22c55e?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-f97316?style=for-the-badge)

**Free ATS Resume Checker — Instantly check how your resume scores against any job posting**

[Live Demo](https://keyscore.vercel.app) • [Install Extension](#-chrome-extension) • [Deploy Your Own](#-deployment)

</div>

---

## ✨ What is KeyScore?

KeyScore is a **free, open-source ATS (Applicant Tracking System) resume checker** that helps job seekers optimize their resumes for specific job postings. Unlike expensive paid tools, KeyScore gives you instant, actionable feedback without any cost.

### 🎯 Key Features

- **📊 Instant ATS Score** — Get your resume's compatibility score in seconds
- **🔑 Keyword Analysis** — See exactly which keywords you're missing
- **💡 Smart Suggestions** — Actionable tips to improve your score
- **🧩 Chrome Extension** — Analyze jobs directly from LinkedIn, Indeed & more
- **🆓 100% Free** — No credit card, no premium tier, no catch
- **🔒 Privacy First** — Your data stays on your device

---

## 🚀 Quick Start

### Option 1: Use the Web App

Visit [keyscore.vercel.app](https://keyscore.vercel.app) and:
1. Upload your resume (PDF or DOCX)
2. Paste the job description
3. Get your ATS score instantly!

### Option 2: Install the Chrome Extension

1. Download the extension from the website
2. Open `chrome://extensions` in Chrome
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extracted folder
5. Click the KeyScore icon on any job posting to analyze

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    KeyScore Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Web App (React + Vite)       API (Express + Node.js)     │
│   ┌───────────────────┐       ┌───────────────────┐        │
│   │ • React 18        │       │ • Express.js      │        │
│   │ • TypeScript      │◄─────►│ • TypeScript      │        │
│   │ • TailwindCSS     │       │ • MongoDB         │        │
│   │ • Shadcn/UI       │       │ • JWT Auth        │        │
│   │ • Zustand         │       │ • PDF/DOCX Parse  │        │
│   └───────────────────┘       └───────────────────┘        │
│                                       │                     │
│   Chrome Extension (Manifest V3)      │                     │
│   ┌───────────────────┐               │                     │
│   │ • Job Detection   │◄──────────────┘                     │
│   │ • One-Click Score │                                     │
│   │ • Quick Analysis  │                                     │
│   └───────────────────┘                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI, Zustand |
| **Backend** | Node.js, Express, TypeScript, MongoDB, JWT |
| **Extension** | Chrome Manifest V3, Content Scripts |
| **Deployment** | Vercel (Web), Render (API), MongoDB Atlas (Database) |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- MongoDB (local or Docker)

### Setup

```bash
# Clone the repository
git clone https://github.com/ebytom/keyscore.git
cd keyscore

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start MongoDB (using Docker)
docker run -d -p 27018:27017 --name keyscore-mongo mongo:7

# Start development servers
pnpm dev
```

The app will be running at:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000

### Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27018/keyscore

# JWT (generate a secure secret)
JWT_SECRET=your-secret-key-here

# Client URL
CLIENT_URL=http://localhost:3000
```

---

## 📁 Project Structure

```
keyscore/
├── packages/
│   ├── web/                 # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── pages/       # Route pages
│   │   │   ├── stores/      # Zustand stores
│   │   │   └── lib/         # Utilities
│   │   └── public/
│   │
│   ├── api/                 # Express backend
│   │   └── src/
│   │       ├── routes/      # API routes
│   │       ├── services/    # Business logic
│   │       ├── models/      # MongoDB models
│   │       └── middleware/  # Auth, error handling
│   │
│   ├── extension/           # Chrome Extension
│   │   ├── popup.html       # Extension popup
│   │   ├── manifest.json    # Manifest V3
│   │   └── content-scripts/ # Page injection
│   │
│   └── shared/              # Shared types & utils
│
└── docs/                    # Documentation
```

---

## 🌐 Deployment

### Deploy to Vercel + Render + MongoDB Atlas (100% Free)

#### 1. Set Up MongoDB Atlas (Free Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create an account
2. Create a **free M0 cluster** (512MB storage)
3. Click **"Connect"** → **"Drivers"** → Copy the connection string
4. Replace `<password>` with your database password
5. Add `/keyscore` before `?` in the URI (e.g., `...mongodb.net/keyscore?retryWrites...`)

#### 2. Deploy API to Render (Free Backend)

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `keyscore` repository
4. Configure:
   - **Name**: `keyscore-api`
   - **Region**: Oregon (US West)
   - **Root Directory**: `packages/api`
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: Free

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Generate with `openssl rand -base64 32` |
   | `CLIENT_URL` | `https://keyscore.vercel.app` (update after Vercel deploy) |

6. Click **"Create Web Service"** and copy your URL (e.g., `https://keyscore-api.onrender.com`)

> ⚠️ **Note**: Free Render services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds.

#### 3. Deploy Web to Vercel (Free Frontend)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → Import your `keyscore` repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/web`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://keyscore-api.onrender.com` (your Render URL, without `/api`)

5. Click **"Deploy"**

#### 4. Update CORS (Final Step)

Go back to Render dashboard and update:
- `CLIENT_URL` = your Vercel URL (e.g., `https://keyscore.vercel.app`)

Trigger a redeploy.

---

### Your Deployment URLs

| Service | URL |
|---------|-----|
| **Frontend** | `https://keyscore.vercel.app` |
| **API** | `https://keyscore-api.onrender.com` |
| **Extension** | `https://keyscore.vercel.app/extension/keyscore-extension.zip` |

---

## 🧩 Chrome Extension

### Build the Extension

```bash
pnpm --filter @keyscore/extension build
```

The built extension will be at `packages/extension/keyscore-extension.zip`.

### Load in Chrome

1. Go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `packages/extension` folder

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Built with ❤️ to help job seekers land more interviews**

[⬆ Back to top](#keyscore)

</div>
