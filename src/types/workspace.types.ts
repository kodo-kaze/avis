import { AnalysisResult } from '@/lib/types';

export interface WorkspaceState {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;

  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetWorkspace: () => void;
}
