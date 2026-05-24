export interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentItem {
  label: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  comment: string;
}

export interface TopicItem {
  topic: string;
  count: number;
}

export interface AnalysisResult {
  summary: string;
  sentiment_distribution: SentimentDistribution;
  sentiments: SentimentItem[];
  topics: TopicItem[];
  keywords: string[];
  wordcloud_url: string | null;
  churn_risk_score: number; // This allows the property to be used in ResultsView
}