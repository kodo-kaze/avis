import { useWorkspaceStore } from '@/store/workspace.store';

export const useWorkspace = () => {
  const {
    analysisResult,
    loading,
    error,
    issues,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
    addIssue,
    setIssues,
  } = useWorkspaceStore();

  return {
    analysisResult,
    loading,
    error,
    issues,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
    addIssue,
    setIssues,
  };
};