import httpx
from typing import List, Dict, Any
from app.config.settings import settings

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
HEADERS = {"Authorization": f"Bearer {settings.HF_TOKEN}"}

async def discover_topics(comments: List[str]) -> List[Dict[str, Any]]:
    if not comments:
        return []

    if not settings.HF_TOKEN:
        return [{"topic": "General Discussion", "count": len(comments)}]

    combined_text = " ".join(comments[:50])
    prompt = f"Identify the top 3 high-level discussion themes or topics from this feedback. For each topic, provide a short name (2-3 words). Return ONLY the topic names separated by pipes (|).\n\nFeedback: {combined_text}\n\nTopics:"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL, 
                headers=HEADERS, 
                json={
                    "inputs": prompt,
                    "parameters": {"max_new_tokens": 50, "return_full_text": False}
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                return [{"topic": "General Feedback", "count": len(comments)}]
                
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                text = result[0].get('generated_text', "")
                topics = [t.strip().title() for t in text.split('|') if t.strip()]
                
                # Heuristic count distribution
                total = len(comments)
                results = []
                for i, t in enumerate(topics[:3]):
                    # Distribute counts roughly for visual UI
                    share = [0.5, 0.3, 0.2]
                    results.append({
                        "topic": t,
                        "count": int(total * share[i]) if i < len(share) else 1
                    })
                return results
            return [{"topic": "Uncategorized", "count": len(comments)}]
    except Exception as e:
        print(f"Error discovering topics via API: {e}")
        return [{"topic": "Analysis Error", "count": len(comments)}]
