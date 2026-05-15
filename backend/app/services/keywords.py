import httpx
from typing import List
from app.config.settings import settings

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
HEADERS = {"Authorization": f"Bearer {settings.HF_TOKEN}"}

async def extract_keywords(comments: List[str], top_n: int = 5) -> List[str]:
    if not comments:
        return []

    if not settings.HF_TOKEN:
        print("HF_TOKEN missing, returning fallback keywords")
        return ["analysis", "feedback", "stakeholder"]

    combined_text = " ".join(comments[:50]) # Limit input for keyword extraction
    prompt = f"Extract the top {top_n} unique keywords or short key phrases from the following stakeholder feedback. Return ONLY a comma-separated list of keywords.\n\nFeedback: {combined_text}\n\nKeywords:"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL, 
                headers=HEADERS, 
                json={
                    "inputs": prompt,
                    "parameters": {"max_new_tokens": 50, "return_full_text": False},
                    "options": {"wait_for_model": True}
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                print(f"Keywords API Error ({response.status_code}): {response.text}")
                return ["General", "Feedback"]
                
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                text = result[0].get('generated_text', "")
                keywords = [kw.strip() for kw in text.split(',') if kw.strip()]
                return keywords[:top_n]
            return []
    except Exception as e:
        print(f"Error extracting keywords via API: {e}")
        return []
