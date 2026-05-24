import { AnalysisResult } from '@/lib/types';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'Resolved' | 'Pending';
  createdAt: string;
  author: string;
}

export interface WorkspaceState {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  issues: Issue[];

  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetWorkspace: () => void;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'status'>) => void;
}
