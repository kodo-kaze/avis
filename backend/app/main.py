from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import analyze
import os

app = FastAPI(
    title="AVIS AI Orchestrator",
    description="Automated Voice Insight System - AI Feedback Pipeline",
    version="1.0.0"
)

# CORS configuration for frontend integration
origins = [
    "https://avis-hq.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated files (like wordclouds) statically
os.makedirs("generated", exist_ok=True)
app.mount("/generated", StaticFiles(directory="generated"), name="generated")

# Include routers
app.include_router(analyze.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AVIS AI Orchestrator"}
