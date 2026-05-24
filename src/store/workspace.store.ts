import { create } from 'zustand';
import { WorkspaceState, Issue } from '@/types/workspace.types';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  analysisResult: null,
  loading: false,
  error: null,
  issues: [],
  selectedIssue: null,
  selectionSource: null,

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
      selectionSource: null,
    }),

  addIssue: (issue) => set((state) => ({
    issues: [issue, ...state.issues]
  })),

  setIssues: (issues) => set({ issues }),

  setSelectedIssue: (issue, source = null) => set({ selectedIssue: issue, selectionSource: source }),
  }));