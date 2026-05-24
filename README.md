# AVIS – AI‑Driven Stakeholder Insight Platform

![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-white?logo=fastapi)
![Python 3.12](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![License MIT](https://img.shields.io/badge/License-MIT-green)

**AVIS** is a next‑generation stakeholder management platform powered by the **SYNAPSE‑AI** engine. It transforms raw stakeholder feedback into actionable intelligence using AI‑driven summarization, sentiment analysis, keyword extraction, and topic discovery, all presented in a sleek 3D interactive UI.

![AVIS preview](/preview.png)


## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Development Workflow](#development-workflow)
- [Testing & Linting](#testing--linting)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- **AI‑powered analysis** – Summarizes, extracts keywords, detects sentiment, and discovers topics from stakeholder comments.
- **Interactive 3D UI** – Real‑time Three.js/React‑Three‑Fiber visualisation.
- **Auth with Clerk** – Secure user management out of the box.
- **Modular backend** – FastAPI orchestrates independent AI pipelines with async calls.
- **Open Graph & Twitter cards** – Optimised meta tags for social sharing and SEO.
- **Configurable via .env** – Set your Hugging Face token and other secrets.

## Architecture
```
frontend (Next.js 16) ──► HTTP API ──► backend (FastAPI)
                         │
                         └─► Hugging Face Inference API (SYNAPSE‑AI engine)
```
- **Frontend** lives in `src/` and uses the App Router.
- **Backend** entry point: `backend/index.py` → `backend/app/main.py`.
- **AI services** are in `backend/app/services/` (summary, sentiment, keywords, topics, word‑cloud).
- Vercel rewrites (`backend/vercel.json`) expose the FastAPI app under the same domain.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui (radix‑lyra), Clerk, Three.js/React‑Three‑Fiber, Framer Motion, GSAP |
| Backend | Python 3.12, FastAPI, Pydantic, Hugging Face `InferenceClient`, Pandas, NLTK, httpx |
| CI/CD | Vercel (frontend & serverless backend), GitHub Actions (optional) |
| Dev Tools | ESLint, Typescript, Prettier, `npm` scripts |

## Getting Started

### Prerequisites
- **Node.js** ≥ 20 (npm, yarn, pnpm or bun)
- **Python** ≥ 3.11
- **Git** (for cloning the repo)
- A **Hugging Face** account with an API token (required for AI calls)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/avis-ai.git
cd avis-ai

# Frontend dependencies
npm install   # or `yarn` / `pnpm` / `bun`

# Backend virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
```

### Environment variables
Create a `.env` file at the repository root:
```
HF_TOKEN=your‑huggingface‑api‑token
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your‑clerk‑publishable‑key
CLERK_SECRET_KEY=your‑clerk‑secret‑key
```
> **Note:** `public/preview.png` is used for Open Graph. Ensure it exists in `public/`.

### Running the application
```bash
# Start the FastAPI backend (development mode)
uvicorn backend.index:app --reload

# In a separate terminal, start the Next.js dev server
npm run dev
```
Open <http://localhost:3000> in your browser. The UI will communicate with the local FastAPI server automatically.

## API Overview
| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/upload` | Upload CSV/JSON/TXT files containing stakeholder comments. Returns the full `AnalysisResponse`. |
| `POST` | `/analyze-text` | Submit raw text (one comment per line). Returns the same analysis payload. |
| `GET` | `/results/{result_id}` | Placeholder for retrieving persisted analysis results (future feature). |

All responses conform to the `AnalysisResponse` Pydantic model (summary, sentiment distribution, sentiments list, topics, keywords, optional word‑cloud URL).

## Development Workflow
- **Hot‑reloading**: Both Next.js and FastAPI watch for file changes.
- **Dynamic titles**: The tab title updates automatically based on the current route via the `TitleUpdater` component.
- **SEO**: Meta data (title, description, Open Graph, Twitter cards, favicon, preview image) is defined in `src/app/layout.tsx`.
- **Linting**: `npm run lint` runs ESLint with the Next.js preset.

## Testing & Linting
```bash
# Frontend lint
npm run lint

# Backend lint (optional)
pip install flake8
flake8 backend/
```
*No dedicated test suite is bundled yet; feel free to add unit/integration tests as needed.*

## Deployment
The project is Vercel‑ready out of the box:
1. Connect the repository to Vercel.
2. Vercel will automatically build the Next.js frontend.
3. The `backend/vercel.json` rewrite proxies `/api/*` requests to the FastAPI serverless function.
4. Configure the required environment variables (`HF_TOKEN`, Clerk keys) in the Vercel dashboard.

## Contributing
Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Ensure the code passes linting (`npm run lint`).
4. Open a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.

---
*Built with love by the AVIS team.*
