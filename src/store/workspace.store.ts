import { create } from 'zustand';
import { WorkspaceState, Issue } from '@/types/workspace.types';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  analysisResult: null,
  loading: false,
  error: null,
  issues: [],
  selectedIssue: null,

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
      selectedIssue: null,
    }),

  addIssue: (issue) => set((state) => ({
    issues: [issue, ...state.issues]
  })),

  setIssues: (issues) => set({ issues }),

  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  }));