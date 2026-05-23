import { useWorkspaceStore } from '@/store/workspace.store';

export const useWorkspace = () => {
  const {
    analysisResult,
    loading,
    error,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
  } = useWorkspaceStore();

  return {
    analysisResult,
    loading,
    error,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
  };
};