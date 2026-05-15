import httpx
from typing import List
from app.config.settings import settings

API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
HEADERS = {"Authorization": f"Bearer {settings.HF_TOKEN}"}

async def generate_summary(comments: List[str]) -> str:
    if not comments:
        return "No comments available to summarize."

    if not settings.HF_TOKEN:
        print("HF_TOKEN missing, returning fallback summary")
        return "Please configure HF_TOKEN to generate AI summaries."

    combined_text = " ".join(comments)
    # Truncate to avoid payload limits
    if len(combined_text) > 4000:
        combined_text = combined_text[:4000]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL, 
                headers=HEADERS, 
                json={
                    "inputs": combined_text,
                    "parameters": {"max_length": 130, "min_length": 30},
                    "options": {"wait_for_model": True}
                },
                timeout=60.0
            )
            
            if response.status_code != 200:
                print(f"Summary API Error ({response.status_code}): {response.text}")
                if response.status_code == 503:
                    return "AI model is currently waking up. Please try again in a few seconds."
                return "Could not generate summary at this time."
                
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                return result[0].get('summary_text', "No summary text returned.")
            return "Unexpected summary format."
    except Exception as e:
        print(f"Error during summarization call: {e}")
        return "Inference failed."
