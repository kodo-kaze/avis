from upstash_redis import Redis
import json
import os
from typing import Optional, Any
from dotenv import load_dotenv

load_dotenv()

# Upstash REST credentials (standard for Vercel deployments)
UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")

class RedisCache:
    def __init__(self):
        if not UPSTASH_URL or not UPSTASH_TOKEN:
            print("⚠️ Upstash credentials missing. Caching disabled.")
            self.client = None
            return
        
        try:
            # upstash-redis uses HTTP/REST, which is ideal for Vercel Serverless Functions
            self.client = Redis(url=UPSTASH_URL, token=UPSTASH_TOKEN)
        except Exception as e:
            print(f"Redis initialization failed: {e}")
            self.client = None

    def get(self, key: str) -> Optional[Any]:
        """Checks if data exists in Upstash. Parses JSON if result is a string."""
        if not self.client:
            return None
        try:
            data = self.client.get(key)
            if not data:
                return None
            
            # upstash-redis might return a JSON string for lists/dicts
            if isinstance(data, str):
                try:
                    return json.loads(data)
                except json.JSONDecodeError:
                    return data
            return data
        except Exception as e:
            print(f"Upstash GET error (falling back to DB): {e}")
            return None

    def set(self, key: str, value: Any, ttl: int = 3600):
        """Cache-Miss Step: Updates Redis via REST."""
        if not self.client:
            return
        try:
            # upstash-redis handles serialization automatically for many types, 
            # but we'll stick to clear JSON/Dict usage.
            self.client.set(key, value, ex=ttl)
        except Exception as e:
            print(f"Upstash SET error: {e}")

    def invalidate(self, key: str):
        """Active Invalidation Step: Clears cache via REST."""
        if not self.client:
            return
        try:
            self.client.delete(key)
        except Exception as e:
            print(f"Upstash DELETE error: {e}")

# Global singleton
cache = RedisCache()
