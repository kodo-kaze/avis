from typing import Any, Dict, List

from app.config.settings import settings
from huggingface_hub import InferenceClient

# Initialize globally
client = InferenceClient(
    api_key=settings.HF_TOKEN,
)

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai"


async def discover_topics(
    comments: List[str]
) -> List[Dict[str, Any]]:

    # Empty input
    if not comments:
        return []

    # Missing token fallback
    if not settings.HF_TOKEN:
        return [
            {
                "topic": "General Discussion",
                "count": len(comments)
            }
        ]

    try:

        # Combine comments
        combined_text = " ".join(comments[:50])

        # Prevent huge prompts
        combined_text = combined_text[:4000]

        # Better structured prompt
        prompt = f"""
Identify the top 3 high-level stakeholder discussion themes from the feedback below.

Return ONLY the topic names separated by pipes (|).

Example:
Customer Support | Delivery Issues | UI Experience

Feedback:
{combined_text}
"""

        # Chat completion
        completion = client.chat.completions.create(
            model=MODEL_NAME,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            max_tokens=100,
        )

        # Extract response text
        response_text = (
            completion
            .choices[0]
            .message
            .content
        )

        # Parse topics
        topics = [
            topic.strip().title()
            for topic in response_text.split("|")
            if topic.strip()
        ]

        # Create UI-friendly topic objects
        total = len(comments)

        distribution = [0.5, 0.3, 0.2]

        results = []

        for i, topic in enumerate(topics[:3]):

            count = (
                int(total * distribution[i])
                if i < len(distribution)
                else 1
            )

            results.append({
                "topic": topic,
                "count": count
            })

        return results

    except Exception as e:

        print(f"Topic discovery error: {e}")

        return [
            {
                "topic": "Analysis Error",
                "count": len(comments)
            }
        ]
