from typing import Any, Dict, List

from app.config.settings import settings
from huggingface_hub import InferenceClient

# Initialize client globally
client = InferenceClient(
    provider="auto",
    api_key=settings.HF_TOKEN,
)

MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"


# Label mapping
LABEL_MAPPING = {
    "LABEL_0": "NEGATIVE",
    "LABEL_1": "NEUTRAL",
    "LABEL_2": "POSITIVE",
}


async def analyze_sentiment(
    comments: List[str]
) -> List[Dict[str, Any]]:

    # Empty input
    if not comments:
        return []

    # Missing token
    if not settings.HF_TOKEN:
        print("HF_TOKEN missing")
        return []

    try:

        formatted_results = []

        # Process comments one by one
        # (more stable than batch inference for HF APIs)
        for comment in comments:

            result = client.text_classification(
                comment,
                model=MODEL_NAME,
            )

            # Handle list response safely
            if not result:
                continue

            # Find best score
            best_match = max(
                result,
                key=lambda x: x.score
            )

            label = LABEL_MAPPING.get(
                best_match.label,
                "UNKNOWN"
            )

            formatted_results.append({
                "comment": comment,
                "label": label,
                "score": float(best_match.score)
            })

        return formatted_results

    except Exception as e:
        print(f"Sentiment analysis error: {e}")
        return []


def calculate_sentiment_distribution(
    sentiments: List[Dict[str, Any]]
) -> Dict[str, float]:

    if not sentiments:
        return {
            "positive": 0,
            "neutral": 0,
            "negative": 0
        }

    counts = {
        "POSITIVE": 0,
        "NEUTRAL": 0,
        "NEGATIVE": 0
    }

    for sentiment in sentiments:

        label = sentiment.get("label")

        if label in counts:
            counts[label] += 1

    total = len(sentiments)

    return {
        "positive": round(
            (counts["POSITIVE"] / total) * 100,
            2
        ),
        "neutral": round(
            (counts["NEUTRAL"] / total) * 100,
            2
        ),
        "negative": round(
            (counts["NEGATIVE"] / total) * 100,
            2
        )
    }
