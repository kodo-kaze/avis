'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspace.store';
import { 
  fetchIssueDetails, 
  deleteIssue, 
  resolveIssue, 
  reopenIssue, 
  createOpinion 
} from '@/services/workspace.service';

export const useIssueOperations = () => {
  const selectedIssue = useWorkspaceStore((state) => state.selectedIssue);
  const selectionSource = useWorkspaceStore((state) => state.selectionSource);
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  const removeIssueFromStore = useWorkspaceStore((state) => state.removeIssue);

  const [opinionText, setOpinionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIssueIdRef = useRef<string | null>(selectedIssue?.id || null);

  // Keep ref in sync
  useEffect(() => {
    if (selectedIssue) {
      currentIssueIdRef.current = selectedIssue.id;
    }
  }, [selectedIssue]);

  const refreshDetails = useCallback(async () => {
    if (!selectedIssue) return;
    const targetId = selectedIssue.id;

    try {
      const data = await fetchIssueDetails(targetId);
      const currentStoredIssue = useWorkspaceStore.getState().selectedIssue;
      
      if (currentIssueIdRef.current === targetId && currentStoredIssue?.id === targetId) {
        setSelectedIssue(data, selectionSource || undefined);
      }
    } catch {
      console.error("Failed to refresh issue details");
    }
  }, [selectedIssue, setSelectedIssue, selectionSource]);

  const handleResolve = async () => {
    if (!selectedIssue) return;
    setIsResolving(true);
    try {
      await resolveIssue(selectedIssue.id);
      await refreshDetails();
    } catch {
      setError("Failed to resolve issue.");
    } finally {
      setIsResolving(false);
    }
  };

  const handleReopen = async () => {
    if (!selectedIssue) return;
    setIsReopening(true);
    try {
      await reopenIssue(selectedIssue.id);
      await refreshDetails();
    } catch {
      setError("Failed to reopen issue.");
    } finally {
      setIsReopening(false);
    }
  };

  const handleDelete = async (onSuccess?: () => void) => {
    if (!selectedIssue) return;
    if (!confirm("Are you sure you want to delete this issue? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      await deleteIssue(selectedIssue.id);
      removeIssueFromStore(selectedIssue.id);
      setSelectedIssue(null);
      onSuccess?.();
    } catch {
      setError("Failed to delete issue.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitOpinion = async (authorName: string) => {
    if (!selectedIssue || !opinionText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createOpinion(selectedIssue.id, {
        text: opinionText,
        author: authorName,
      });
      setOpinionText('');
      await refreshDetails();
    } catch {
      setError('Failed to submit opinion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    opinionText,
    setOpinionText,
    isSubmitting,
    isDeleting,
    isResolving,
    isReopening,
    error,
    setError,
    refreshDetails,
    handleResolve,
    handleReopen,
    handleDelete,
    handleSubmitOpinion,
    selectedIssue,
    selectionSource,
    setSelectedIssue,
  };
};
