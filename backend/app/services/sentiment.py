import httpx
from typing import List, Dict, Any
from app.config.settings import settings

API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment"
HEADERS = {"Authorization": f"Bearer {settings.HF_TOKEN}"}

# Map roberta labels to human readable
LABEL_MAPPING = {
    "LABEL_0": "NEGATIVE",
    "LABEL_1": "NEUTRAL",
    "LABEL_2": "POSITIVE"
}

async def analyze_sentiment(comments: List[str]) -> List[Dict[str, Any]]:
    if not comments:
        return []

    if not settings.HF_TOKEN:
        print("HF_TOKEN missing, returning empty sentiment")
        return []

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                API_URL, 
                headers=HEADERS, 
                json={"inputs": comments},
                timeout=30.0
            )
            
            if response.status_code != 200:
                print(f"Sentiment API Error: {response.text}")
                return []
                
            results = response.json()
            
            # The API returns a nested list: [[{"label": "...", "score": ...}, ...]]
            # or sometimes just a list depending on input size/batching.
            # Standardize for batch input
            formatted_results = []
            
            # Handle potential different response formats from HF
            for comment, result_list in zip(comments, results):
                # result_list is usually a list of scores for each label
                # we find the one with the highest score
                best_match = max(result_list, key=lambda x: x['score'])
                label = LABEL_MAPPING.get(best_match['label'], "UNKNOWN")
                formatted_results.append({
                    "comment": comment,
                    "label": label,
                    "score": float(best_match['score'])
                })
            
            return formatted_results
    except Exception as e:
        print(f"Failed to call Sentiment API: {e}")
        return []

def calculate_sentiment_distribution(sentiments: List[Dict[str, Any]]) -> Dict[str, float]:
    if not sentiments:
        return {"positive": 0, "neutral": 0, "negative": 0}
        
    counts = {"POSITIVE": 0, "NEUTRAL": 0, "NEGATIVE": 0}
    for s in sentiments:
        if s['label'] in counts:
            counts[s['label']] += 1
            
    total = len(sentiments)
    return {
        "positive": round((counts["POSITIVE"] / total) * 100, 2),
        "neutral": round((counts["NEUTRAL"] / total) * 100, 2),
        "negative": round((counts["NEGATIVE"] / total) * 100, 2)
    }
