from typing import List

from app.config.settings import settings
from huggingface_hub import InferenceClient

# Initialize ONCE globally
client = InferenceClient(
    provider="auto",
    api_key=settings.HF_TOKEN,
)

MODEL_NAME = "facebook/bart-large-cnn"


async def generate_summary(comments: List[str]) -> str:

    # Empty input handling
    if not comments:
        return "No comments available to summarize."

    # Missing token fallback
    if not settings.HF_TOKEN:
        print("HF_TOKEN missing")
        return "Please configure HF_TOKEN to generate summaries."

    try:

        # Combine comments
        combined_text = " ".join(comments)

        # Prevent payload overflow
        combined_text = combined_text[:4000]

        # HuggingFace inference call
        result = client.summarization(
            combined_text,
            model=MODEL_NAME,
        )

        # Safe extraction
        if hasattr(result, "summary_text"):
            return result.summary_text

        return "No summary generated."

    except Exception as e:
        print(f"Summary generation error: {e}")
        return "Failed to generate summary."
