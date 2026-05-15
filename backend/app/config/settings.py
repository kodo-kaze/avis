# Configuration file for future DB and Redis placeholders

import os

class Config:
    PROJECT_NAME = "AVIS Backend"
    
    # Postgres Placeholder
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/avis_db")
    
    # Redis Placeholder
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

settings = Config()
