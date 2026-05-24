import { useWorkspaceStore } from '@/store/workspace.store';

export const useWorkspace = () => {
  const {
    analysisResult,
    loading,
    error,
    issues,
    selectedIssue,
    selectionSource,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
    addIssue,
    setIssues,
    setSelectedIssue,
  } = useWorkspaceStore();

  return {
    analysisResult,
    loading,
    error,
    issues,
    selectedIssue,
    selectionSource,
    setAnalysisResult,
    setLoading,
    setError,
    resetWorkspace,
    addIssue,
    setIssues,
    setSelectedIssue,
  };
};