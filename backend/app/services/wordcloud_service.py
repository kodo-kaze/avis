from wordcloud import WordCloud
import matplotlib
matplotlib.use('Agg') # Required for serverless/non-interactive environments
import matplotlib.pyplot as plt
import os
import uuid
from typing import List, Optional

def generate_wordcloud(comments: List[str]) -> Optional[str]:
    if not comments:
        return None

    combined_text = " ".join(comments)
    
    try:
        wordcloud = WordCloud(
            width=800, 
            height=400, 
            background_color='white',
            colormap='viridis'
        ).generate(combined_text)
        
        # Save to file
        filename = f"wordcloud_{uuid.uuid4().hex}.png"
        filepath = os.path.join("generated", filename)
        
        # Plot and save
        plt.figure(figsize=(10, 5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.tight_layout(pad=0)
        plt.savefig(filepath, format="png", bbox_inches='tight')
        plt.close()
        
        # Return URL path (assuming served statically at /generated)
        return f"/generated/{filename}"
    except Exception as e:
        print(f"Error generating wordcloud: {e}")
        return None
