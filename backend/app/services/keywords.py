from keybert import KeyBERT
from typing import List

_kw_model = None

def get_kw_model():
    global _kw_model
    if _kw_model is None:
        try:
            _kw_model = KeyBERT()
        except Exception as e:
            print(f"Failed to load KeyBERT: {e}")
    return _kw_model

def extract_keywords(comments: List[str], top_n: int = 5) -> List[str]:
    model = get_kw_model()
    if not model or not comments:
        return []

    combined_text = " ".join(comments)
    
    try:
        # Extract keywords
        keywords_with_scores = model.extract_keywords(
            combined_text, 
            keyphrase_ngram_range=(1, 2), 
            stop_words='english', 
            top_n=top_n
        )
        
        # Return just the keyword strings
        return [kw[0] for kw in keywords_with_scores]
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return []
