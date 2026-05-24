from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SentimentDistribution(BaseModel):
    positive: float
    neutral: float
    negative: float

class SentimentResult(BaseModel):
    comment: str
    label: str
    score: float

class TopicResult(BaseModel):
    topic: str
    count: int

class AnalysisResponse(BaseModel):
    summary: str
    sentiment_distribution: SentimentDistribution
    sentiments: List[SentimentResult]
    topics: List[TopicResult]
    keywords: List[str]
    wordcloud_url: Optional[str] = None
    churn_risk_score: float | None = None

class TextInput(BaseModel):
    text: str
