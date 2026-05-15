import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

class Config:
    PROJECT_NAME = "AVIS Backend"
    
    # Hugging Face Inference API
    HF_TOKEN = os.getenv("HF_TOKEN", "")
    
    # Database Configuration (Neon PostgreSQL)
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    
    # Redis Placeholder
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

settings = Config()
