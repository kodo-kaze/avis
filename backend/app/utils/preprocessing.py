from typing import List
from app.utils.cleaner import clean_text

def preprocess_comments(raw_comments: List[str]) -> List[str]:
    """
    Cleans and filters comments.
    Implements lowercasing, whitespace cleanup, null/empty filtering, and duplicate removal.
    """
    cleaned = []
    seen = set()
    
    for comment in raw_comments:
        if not comment or not isinstance(comment, str):
            continue
            
        c_text = clean_text(comment)
        
        # Filter too short or empty comments
        if len(c_text) < 3:
            continue
            
        # Deduplicate
        if c_text not in seen:
            seen.add(c_text)
            cleaned.append(c_text)
            
    return cleaned
