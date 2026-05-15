import asyncio
from typing import List
from app.schemas.response_schema import AnalysisResponse
from app.services.sentiment import analyze_sentiment, calculate_sentiment_distribution
from app.services.summary import generate_summary
from app.services.keywords import extract_keywords
from app.services.topics import discover_topics
from app.services.wordcloud_service import generate_wordcloud

async def process_feedback(comments: List[str]) -> AnalysisResponse:
    """
    Central orchestrator that runs all AI pipelines independently
    using async HF API calls and combines their outputs.
    """
    if not comments:
        return AnalysisResponse(
            summary="No comments provided.",
            sentiment_distribution={"positive": 0.0, "neutral": 0.0, "negative": 0.0},
            sentiments=[],
            topics=[],
            keywords=[],
            wordcloud_url=None
        )

    # Execute all AI pipelines concurrently for performance
    # Note: wordcloud_service is currently synchronous (CPU bound), 
    # we can run it in a thread if needed, but for now simple await.
    
    # We use asyncio.gather to trigger all network requests in parallel
    tasks = [
        analyze_sentiment(comments),
        generate_summary(comments),
        extract_keywords(comments),
        discover_topics(comments)
    ]
    
    # Wait for all inference results
    results = await asyncio.gather(*tasks)
    
    sentiments = results[0]
    summary = results[1]
    keywords = results[2]
    topics = results[3]

    # Post-process sentiments
    sentiment_dist = calculate_sentiment_distribution(sentiments)

    # Word cloud is local/fast enough for synchronous execution here
    wordcloud_url = generate_wordcloud(comments)

    return AnalysisResponse(
        summary=summary,
        sentiment_distribution=sentiment_dist,
        sentiments=sentiments,
        topics=topics,
        keywords=keywords,
        wordcloud_url=wordcloud_url
    )
