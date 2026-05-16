from typing import List

from app.config.settings import settings
from huggingface_hub import InferenceClient

# Initialize globally
client = InferenceClient(
    api_key=settings.HF_TOKEN,
)

MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai"


async def extract_keywords(
    comments: List[str],
    top_n: int = 5
) -> List[str]:

    # Empty input
    if not comments:
        return []

    # Missing token
    if not settings.HF_TOKEN:
        print("HF_TOKEN missing")

        return [
            "analysis",
            "feedback",
            "stakeholder"
        ]

    try:

        # Merge comments
        combined_text = " ".join(comments[:50])

        # Prevent huge prompts
        combined_text = combined_text[:4000]

        # Better structured prompt
        prompt = f"""
Extract the top {top_n} meaningful keywords or short key phrases from the stakeholder feedback below.

Return ONLY a comma-separated list.

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

        # Parse keywords
        keywords = [
            keyword.strip()
            for keyword in response_text.split(",")
            if keyword.strip()
        ]

        return keywords[:top_n]

    except Exception as e:

        print(f"Keyword extraction error: {e}")

        return [
            "analysis",
            "feedback",
            "stakeholder"
        ]
