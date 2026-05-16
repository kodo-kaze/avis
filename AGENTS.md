<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TS, Tailwind 4, Clerk (Auth), Three.js/React Three Fiber, Framer Motion/GSAP.
- **Backend**: Python FastAPI, Pydantic, Pandas, NLTK.

## Architecture
- `/src`: Frontend source. `@/*` alias -> `src/`.
- `/backend`: FastAPI backend. Entry: `backend/index.py` -> `backend/app/main.py`.
- `/test_data`: Feedback samples (CSV, JSON, TXT).

## Developer Commands
- `npm run dev`: Frontend dev server.
- `npm run build`: Frontend build.
- `npm run start`: Frontend prod server.
- `npm run lint`: Frontend lint.
- Backend: Standard FastAPI (e.g., `uvicorn backend.index:app --reload`).

## Conventions & Quirks
- **UI**: shadcn/ui variant `radix-lyra` using `@uilora` registry. Components in `@/components/ui`.
- **Auth**: Clerk (`@clerk/nextjs`).
- **Env**: Use `.env` for secrets/config.
