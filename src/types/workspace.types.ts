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
}

export interface WorkspaceState {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;

  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetWorkspace: () => void;
}