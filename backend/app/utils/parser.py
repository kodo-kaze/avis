import pandas as pd
import json
import io
from typing import List

def parse_file_to_comments(file_content: bytes, filename: str) -> List[str]:
    """
    Robustly parses CSV, JSON, or TXT into a list of strings (comments).
    """
    filename_lower = filename.lower()
    comments = []
    
    try:
        if filename_lower.endswith(".csv"):
            # Attempt to read CSV
            df = pd.read_csv(io.BytesIO(file_content))
            
            # Detect likely comment columns (heuristic)
            comment_cols = [col for col in df.columns if 'comment' in col.lower() or 'feedback' in col.lower() or 'text' in col.lower()]
            
            if comment_cols:
                col = comment_cols[0]
            else:
                # Fallback to the first string column that has long average length
                col = df.columns[0] # Very naive fallback
                
            comments = df[col].dropna().astype(str).tolist()

        elif filename_lower.endswith(".json"):
            data = json.loads(file_content.decode("utf-8"))
            
            if isinstance(data, list):
                # E.g., [{"comment": "value"}, {"comment": "value"}]
                for item in data:
                    if isinstance(item, dict):
                        # Find a reasonable key
                        for key in ["comment", "feedback", "text", "body"]:
                            if key in item and item[key]:
                                comments.append(str(item[key]))
                                break
                    elif isinstance(item, str):
                        comments.append(item)
            elif isinstance(data, dict):
                # Find any list of strings or dicts inside
                for k, v in data.items():
                    if isinstance(v, list) and len(v) > 0 and isinstance(v[0], str):
                        comments.extend(v)

        elif filename_lower.endswith(".txt"):
            text = file_content.decode("utf-8")
            # Assume each line or paragraph is a comment
            comments = [line.strip() for line in text.split('\n') if line.strip()]

    except Exception as e:
        print(f"Error parsing file: {e}")
        # In a real app, we might raise a custom exception here
        pass

    return comments
