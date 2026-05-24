import { create } from 'zustand';
import { WorkspaceState } from '@/types/workspace.types';

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

  removeIssue: (issueId) => set((state) => ({
    issues: state.issues.filter((i) => i.id !== issueId)
  })),

  setSelectedIssue: (issue, source) => set({ 
    selectedIssue: issue, 
    selectionSource: source || null 
  }),
  }));