from transformers import pipeline
from typing import List

_summary_pipeline = None

def get_summary_pipeline():
    global _summary_pipeline
    if _summary_pipeline is None:
        try:
            _summary_pipeline = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                truncation=True
            )
        except Exception as e:
            print(f"Failed to load summarization model: {e}")
    return _summary_pipeline

def generate_summary(comments: List[str]) -> str:
    pipe = get_summary_pipeline()
    if not pipe or not comments:
        return "No comments available to summarize."

    # Combine comments for summarization. 
    # If too long, we take a subset or chunk it. For simplicity, join and truncate.
    combined_text = " ".join(comments)
    
    # BART max length is 1024 tokens. We'll rely on the pipeline's truncation.
    # To avoid massive inference time, limit character length
    max_chars = 4000 
    if len(combined_text) > max_chars:
        combined_text = combined_text[:max_chars]

    try:
        summary = pipe(combined_text, max_length=130, min_length=30, do_sample=False)
        if summary and len(summary) > 0:
            return summary[0]['summary_text']
    except Exception as e:
        print(f"Error during summarization: {e}")
        
    return "Could not generate summary."
