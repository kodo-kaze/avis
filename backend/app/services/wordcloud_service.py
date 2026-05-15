from wordcloud import WordCloud
import matplotlib
matplotlib.use('Agg') # Required for serverless/non-interactive environments
import matplotlib.pyplot as plt
import io
import base64
from typing import List, Optional

def generate_wordcloud(comments: List[str]) -> Optional[str]:
    """
    Generates a word cloud in memory and returns it as a base64 encoded string.
    This avoids filesystem permission issues on serverless platforms like Vercel.
    """
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
        
        # Plot to a buffer
        plt.figure(figsize=(10, 5))
        plt.imshow(wordcloud, interpolation='bilinear')
        plt.axis('off')
        plt.tight_layout(pad=0)
        
        buf = io.BytesIO()
        plt.savefig(buf, format="png", bbox_inches='tight')
        plt.close()
        
        # Encode to base64
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{image_base64}"
    except Exception as e:
        print(f"Error generating wordcloud: {e}")
        return None
