# AI Job Search Copilot

<div align="center">

![AI Job Search Copilot](https://img.shields.io/badge/AI-Job%20Search%20Copilot-blue?style=for-the-badge&logo=openai)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**An intelligent AI-powered career assistant that automates every stage of the job search journey**

[Demo](https://ai-job-copilot.vercel.app) • [Documentation](./docs) • [Contributing](./CONTRIBUTING.md)

</div>

---

## 🚀 Overview

AI Job Search Copilot is a production-ready SaaS platform that transforms the job search experience through AI automation. Unlike traditional job boards or simple resume builders, this platform acts as a true AI co-pilot—providing personalized guidance, automated analysis, and intelligent recommendations throughout your entire job search lifecycle.

### Key Features

- **🔍 Chrome Extension** - One-click job analysis from LinkedIn, Indeed, and more
- **📄 Resume Intelligence** - AI-powered parsing, optimization, and ATS scoring
- **✉️ Cover Letter Generation** - Personalized, role-specific cover letters
- **🎯 ATS Match Scoring** - Real-time compatibility analysis with actionable insights
- **🎤 Mock Interviews** - AI-powered practice sessions (HR, Technical, System Design)
- **📊 Job Tracker** - End-to-end application pipeline management
- **🎓 Career Coaching** - Personalized guidance and learning roadmaps
- **🏢 Company Research** - AI-synthesized intelligence on target companies

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AI Job Search Copilot (MERN Stack)              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Frontend (React+Vite)    Backend (Express)     AI Layer           │
│   ┌─────────────────┐     ┌─────────────────┐   ┌─────────────────┐│
│   │ • React 18      │     │ • Node.js       │   │ • OpenAI GPT-4  ││
│   │ • TypeScript    │◄───►│ • TypeScript    │◄─►│ • LangChain     ││
│   │ • TailwindCSS   │     │ • MongoDB       │   │ • LangGraph     ││
│   │ • Shadcn/UI     │     │ • Redis         │   │ • Qdrant        ││
│   │ • Zustand       │     │ • JWT Auth      │   │ • RAG Pipeline  ││
│   └─────────────────┘     └─────────────────┘   └─────────────────┘│
│           │                        │                     │          │
│           └────────────────────────┼─────────────────────┘          │
│                                    │                                │
│   Chrome Extension (Manifest V3)   │                                │
│   ┌─────────────────┐              │                                │
│   │ • Job Detection │◄─────────────┘                                │
│   │ • Quick Analysis│                                               │
│   │ • One-Click Save│                                               │
│   └─────────────────┘                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend (MERN - React)
- **Build Tool:** Vite
- **UI Library:** React 18
- **Language:** TypeScript
- **Styling:** TailwindCSS + Shadcn/UI
- **Animation:** Framer Motion
- **State:** Zustand + TanStack Query
- **Routing:** React Router DOM
- **Forms:** React Hook Form + Zod

### Backend (MERN - Express + Node)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- **Auth:** JWT + Passport.js (Google, GitHub OAuth)

### AI Stack
- **LLM:** OpenAI GPT-4
- **Framework:** LangChain + LangGraph
- **Embeddings:** OpenAI Embeddings
- **Vector DB:** Qdrant
- **Architecture:** RAG + Multi-Agent

### Infrastructure
- **Containers:** Docker + Kubernetes
- **CI/CD:** GitHub Actions
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Railway/AWS
- **Storage:** AWS S3 / Cloudinary

---

## 📚 Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [PRD](./docs/PRD.md) | Product Requirements Document | ✅ Complete |
| [SRS](./docs/SRS.md) | Software Requirements Specification | ✅ Complete |
| [User Personas](./docs/USER_PERSONAS.md) | Detailed User Personas | ✅ Complete |
| [User Stories](./docs/USER_STORIES.md) | User Stories & Product Backlog | ✅ Complete |
| [HLD](./docs/architecture/HLD.md) | High-Level Design | ⏳ Pending |
| [LLD](./docs/architecture/LLD.md) | Low-Level Design | ⏳ Pending |
| [Database Design](./docs/architecture/DATABASE.md) | MongoDB Schema Design | ⏳ Pending |
| [API Documentation](./docs/api/README.md) | REST API Reference | ⏳ Pending |
| [Deployment Guide](./docs/guides/DEPLOYMENT.md) | Infrastructure Setup | ⏳ Pending |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-job-copilot.git
cd ai-job-copilot

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development environment
docker-compose up -d  # MongoDB, Redis, Qdrant
pnpm dev              # Start all packages
```

### Environment Variables

```env
# Authentication
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
MONGODB_URI=mongodb://localhost:27017/ai-job-copilot
REDIS_URL=redis://localhost:6379

# AI
OPENAI_API_KEY=
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Storage
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 📁 Project Structure

```
ai-job-copilot/
├── packages/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities
│   │   └── styles/         # Global styles
│   │
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── utils/
│   │   └── tests/
│   │
│   ├── extension/           # Chrome Extension
│   │   ├── src/
│   │   ├── public/
│   │   └── manifest.json
│   │
│   ├── ai-agents/           # LangGraph agents
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   ├── tools/
│   │   │   ├── chains/
│   │   │   └── graphs/
│   │   └── tests/
│   │
│   └── shared/              # Shared utilities
│       ├── types/
│       ├── constants/
│       └── utils/
│
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
│
├── docs/
│   ├── PRD.md
│   ├── SRS.md
│   ├── architecture/
│   ├── api/
│   └── guides/
│
└── scripts/
```

---

## 🎯 Development Phases

### Phase 1: MVP (Current)
- [x] Product Requirements Document
- [ ] Software Requirements Specification
- [ ] System Architecture Design
- [ ] Database Schema Design
- [ ] UI/UX Design System
- [ ] Authentication System
- [ ] Resume Intelligence
- [ ] Chrome Extension
- [ ] ATS Scoring
- [ ] Cover Letter Generation
- [ ] Job Tracker

### Phase 2: Enhancement
- [ ] Mock Interview System
- [ ] Skill Gap Analysis
- [ ] Learning Roadmaps
- [ ] Company Research
- [ ] Advanced Dashboard
- [ ] Mobile PWA

### Phase 3: Scale
- [ ] Career Coaching AI
- [ ] Team Features
- [ ] API Access
- [ ] Enterprise Features

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 and embeddings
- LangChain team for the amazing framework
- Shadcn for the beautiful UI components
- The open-source community

---

<div align="center">

**Built with ❤️ for job seekers everywhere**

[⬆ Back to top](#ai-job-search-copilot)

</div>
