import { AnalysisResult } from '@/lib/types';

export interface Opinion {
  id: string;
  issueId: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'Resolved' | 'Pending';
  createdAt: string;
  author: string;
  analysisResult?: AnalysisResult;
  opinions?: Opinion[];
}

export interface WorkspaceState {
  analysisResult: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  issues: Issue[];
  selectedIssue: Issue | null;
  selectionSource: 'all' | 'pipeline' | null;

  setAnalysisResult: (result: AnalysisResult | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetWorkspace: () => void;
  addIssue: (issue: Issue) => void;
  setIssues: (issues: Issue[]) => void;
  setSelectedIssue: (issue: Issue | null, source?: 'all' | 'pipeline') => void;
}
