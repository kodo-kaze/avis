'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useWorkspaceStore } from '@/store/workspace.store';
import { createOpinion, fetchIssueDetails } from '@/services/workspace.service';
import ResultsView from '@/components/workspace/ResultsView';

export default function PipelineIssueDetail() {
  const { user } = useUser();
  const selectedIssue = useWorkspaceStore((state) => state.selectedIssue);
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  
  const [opinionText, setOpinionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshDetails = useCallback(async () => {
    if (!selectedIssue) return;
    try {
      const data = await fetchIssueDetails(selectedIssue.id);
      setSelectedIssue({
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt: data.created_at,
        author: data.author,
        analysisResult: data.analysis_result,
        opinions: data.opinions.map((o: { id: number | string; issue_id: number | string; text: string; author: string; created_at: string }) => ({
          id: o.id.toString(),
          issueId: o.issue_id.toString(),
          text: o.text,
          author: o.author,
          createdAt: o.created_at
        }))
      }, 'pipeline');
    } catch (err) {
      console.error("Failed to refresh issue details", err);
    }
  }, [selectedIssue, setSelectedIssue]);

  useEffect(() => {
    refreshDetails();
  }, [refreshDetails]);

  const handleSubmitOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue || !opinionText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createOpinion(selectedIssue.id, {
        text: opinionText,
        author: user?.fullName || user?.username || 'Anonymous User',
      });
      setOpinionText('');
      await refreshDetails();
    } catch {
      console.error('Failed to submit opinion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedIssue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden h-fit max-h-[80vh] flex flex-col"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedIssue(null)}
            className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-tight truncate">{selectedIssue.title}</h3>
            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Pipeline Concern Detail</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-8 custom-scrollbar">
          {/* AI Analysis Section - HIGHLIGHTED HERE */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest">AI Consensus</h4>
            </div>

            {selectedIssue.analysisResult ? (
              <div className="scale-95 origin-top">
                <ResultsView
                  data={selectedIssue.analysisResult}
                  onReset={() => {}}
                  hideHeader={true}
                />
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                <Loader2 className="animate-spin text-white/20 mx-auto" size={20} />
                <p className="text-[10px] text-white/30 font-mono uppercase leading-relaxed">
                  Consensus forming... Needs {Math.max(0, 3 - (selectedIssue.opinions?.length || 0))} more opinions.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest">Description</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              {selectedIssue.description}
            </p>
          </div>

          {/* Opinions */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} />
              Opinions ({selectedIssue.opinions?.length || 0})
            </h4>

            <form onSubmit={handleSubmitOpinion} className="relative">
              <textarea
                value={opinionText}
                onChange={(e) => setOpinionText(e.target.value)}
                placeholder="Share perspective..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none h-20"
              />
              <button
                type="submit"
                disabled={isSubmitting || !opinionText.trim()}
                className="absolute bottom-2 right-2 p-1.5 bg-white text-black rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              </button>
            </form>

            <div className="space-y-3">
              {selectedIssue.opinions?.map((opinion) => (
                <div key={opinion.id} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/60">{opinion.author}</span>
                    <span className="text-[8px] font-mono text-white/20">{new Date(opinion.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed">{opinion.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
