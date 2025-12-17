# HireSense - Smart Remote Job Finder

> Find remote jobs that actually fit you — not just your keywords.

![HireSense](https://img.shields.io/badge/HireSense-AI%20Powered-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=flat-square&logo=go)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

## 🎯 Overview

HireSense is an AI-powered remote job discovery platform that aggregates listings from multiple job boards, analyzes user profiles, and delivers personalized job recommendations using OpenAI.

### Core Features

- 🔍 **Smart Search** - Advanced filtering by skills, experience, salary
- 🧠 **AI Matching** - Get match scores with explanations of why jobs fit you
- 📊 **Profile Analysis** - AI insights on your skills and market demand
- ❤️ **Save & Track** - Bookmark jobs and track applications
- 📅 **Auto Updates** - Daily refreshed listings via cron jobs
- 🔐 **Secure Auth** - JWT-based authentication with refresh tokens

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Go 1.22, Gin Framework |
| Database | MongoDB Atlas |
| AI | OpenAI GPT-4o-mini |
| Deployment | GCP Cloud Run, GitHub Actions |

## 📁 Project Structure

```
HireSense/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux slices
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   └── types/            # TypeScript types
│   └── package.json
├── backend/                  # Go REST API
│   ├── cmd/server/           # Entry point
│   ├── internal/
│   │   ├── auth/             # Authentication
│   │   ├── users/            # User management
│   │   ├── jobs/             # Job listings
│   │   ├── ai/               # AI recommendations
│   │   ├── scraper/          # Job scrapers
│   │   └── middleware/       # HTTP middlewares
│   └── pkg/jwt/              # JWT utilities
├── .github/workflows/        # CI/CD pipelines
└── docs/                     # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Go 1.22+
- MongoDB (local or Atlas)
- OpenAI API key

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Download dependencies
go mod tidy

# Run the server
go run cmd/server/main.go
```

The API runs at `http://localhost:8080`

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/hiresense
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Sign in |
| POST | `/auth/refresh` | Refresh tokens |
| GET | `/auth/me` | Get current user |

### Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List/search jobs |
| GET | `/jobs/:id` | Get job details |
| GET | `/jobs/saved` | Get saved jobs |
| POST | `/jobs/:id/save` | Save a job |
| DELETE | `/jobs/:id/save` | Unsave a job |
| POST | `/jobs/:id/hide` | Hide a job |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ai/recommend` | Get recommendations |
| POST | `/ai/analyze-profile` | Analyze profile |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/scrape` | Trigger job scrape |
| GET | `/admin/stats` | Get statistics |

## 🔄 Job Sources

HireSense aggregates jobs from:

- **RemoteOK** - via public API
- **Remotive** - via public API

## 🚢 Deployment

### Using GitHub Actions

1. Set up GCP Cloud Run
2. Add secrets to GitHub:
   - `GCP_PROJECT_ID`
   - `GCP_SA_KEY`
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
3. Push to `main` branch

### Manual Docker Deployment

```bash
cd backend
docker build -t hiresense-api .
docker run -p 8080:8080 --env-file .env hiresense-api
```

## 📅 Scheduled Jobs

Daily job scraping is configured via GitHub Actions (`.github/workflows/scrape-jobs.yml`):

- Runs at 6 AM UTC
- Can be manually triggered

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for remote workers everywhere.
