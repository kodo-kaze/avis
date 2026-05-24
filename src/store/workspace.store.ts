import { create } from 'zustand';
import { WorkspaceState, Issue } from '@/types/workspace.types';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  analysisResult: null,
  loading: false,
  error: null,
  issues: [
    {
      id: '1',
      title: 'UI Lag in Analysis',
      description: 'The charts take too long to render on mobile devices.',
      status: 'Open',
      createdAt: new Date().toISOString(),
      author: 'John Doe',
    },
    {
      id: '2',
      title: 'Inaccurate Sentiment',
      description: 'The model misclassified several neutral comments as negative.',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      author: 'Jane Smith',
    }
  ],

  setAnalysisResult: (result) =>
    set({ analysisResult: result }),

  setLoading: (loading) =>
    set({ loading }),

  setError: (error) =>
    set({ error }),

  resetWorkspace: () =>
    set({
      analysisResult: null,
      loading: false,
      error: null,
    }),

  addIssue: (issueData) => set((state) => ({
    issues: [
      {
        ...issueData,
        id: Math.random().toString(36).substring(7),
        status: 'Open',
        createdAt: new Date().toISOString(),
      },
      ...state.issues,
    ]
  })),
}));