import { create } from 'zustand';
import { WorkspaceState } from '@/types/workspace.types';

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  analysisResult: null,
  loading: false,
  error: null,

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
}));