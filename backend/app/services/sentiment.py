from transformers import pipeline
from typing import List, Dict, Any

# Load model globally to avoid reloading per request
# cardiffnlp/twitter-roberta-base-sentiment
_sentiment_pipeline = None

def get_sentiment_pipeline():
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        try:
            _sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment",
                tokenizer="cardiffnlp/twitter-roberta-base-sentiment",
                truncation=True,
                max_length=512
            )
        except Exception as e:
            print(f"Failed to load sentiment model: {e}")
    return _sentiment_pipeline

# Map roberta labels to human readable
LABEL_MAPPING = {
    "LABEL_0": "NEGATIVE",
    "LABEL_1": "NEUTRAL",
    "LABEL_2": "POSITIVE"
}

def analyze_sentiment(comments: List[str]) -> List[Dict[str, Any]]:
    pipe = get_sentiment_pipeline()
    if not pipe or not comments:
        return []

    # Batch process
    results = pipe(comments)
    
    formatted_results = []
    for comment, result in zip(comments, results):
        label = LABEL_MAPPING.get(result['label'], "UNKNOWN")
        formatted_results.append({
            "comment": comment,
            "label": label,
            "score": float(result['score'])
        })
        
    return formatted_results

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
