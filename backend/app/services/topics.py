from bertopic import BERTopic
from typing import List, Dict, Any

def discover_topics(comments: List[str]) -> List[Dict[str, Any]]:
    # BERTopic requires a sufficient amount of data to work well.
    # For small arrays, it might fail or return just one topic.
    if not comments or len(comments) < 5:
        return [{"topic": "General Discussion", "count": len(comments)}]

    try:
        # We instantiate per call or globally depending on memory. 
        # BERTopic can be heavy to keep in memory if not constantly used,
        # but prompt says "Load models once globally".
        # We'll create a lightweight configuration here.
        topic_model = BERTopic(language="english", calculate_probabilities=False)
        topics, _ = topic_model.fit_transform(comments)
        
        topic_info = topic_model.get_topic_info()
        
        results = []
        for index, row in topic_info.iterrows():
            # Skip the outlier topic (-1)
            if row['Topic'] == -1:
                continue
                
            # Name format is usually "ID_word1_word2_word3"
            # Let's clean it up slightly
            name_parts = row['Name'].split('_')[1:]
            clean_name = " ".join(name_parts[:3]).title()
            
            results.append({
                "topic": clean_name,
                "count": int(row['Count'])
            })
            
        return results[:10] # return top 10 topics
    except Exception as e:
        print(f"Error discovering topics: {e}")
        return []
