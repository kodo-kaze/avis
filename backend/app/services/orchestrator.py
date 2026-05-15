from typing import List
from app.schemas.response_schema import AnalysisResponse
from app.services.sentiment import analyze_sentiment, calculate_sentiment_distribution
from app.services.summary import generate_summary
from app.services.keywords import extract_keywords
from app.services.topics import discover_topics
from app.services.wordcloud_service import generate_wordcloud

def process_feedback(comments: List[str]) -> AnalysisResponse:
    """
    Central orchestrator that runs all AI pipelines independently
    and combines their outputs into a single structured response.
    """
    if not comments:
        # Return empty structure if no valid comments
        return AnalysisResponse(
            summary="No comments provided.",
            sentiment_distribution={"positive": 0.0, "neutral": 0.0, "negative": 0.0},
            sentiments=[],
            topics=[],
            keywords=[],
            wordcloud_url=None
        )

    # 1. Sentiment Analysis
    sentiments = analyze_sentiment(comments)
    sentiment_dist = calculate_sentiment_distribution(sentiments)

    # 2. Summarization
    summary = generate_summary(comments)

    # 3. Keyword Extraction
    keywords = extract_keywords(comments)

    # 4. Topic Modeling
    topics = discover_topics(comments)

    # 5. Word Cloud Generation
    wordcloud_url = generate_wordcloud(comments)

    # Combine into unified response
    response = AnalysisResponse(
        summary=summary,
        sentiment_distribution=sentiment_dist,
        sentiments=sentiments,
        topics=topics,
        keywords=keywords,
        wordcloud_url=wordcloud_url
    )

    return response
