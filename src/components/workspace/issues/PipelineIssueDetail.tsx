'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Send, Loader2, CheckCircle2, Trash2, CheckCircle, RotateCcw, Share2, Lock } from 'lucide-react';
import { useIssueOperations } from '@/hooks/useIssueOperations';
import ResultsView from '@/components/workspace/ResultsView';

export default function PipelineIssueDetail() {
  const {
    opinionText,
    setOpinionText,
    isSubmitting,
    isDeleting,
    isResolving,
    isReopening,
    error,
    refreshDetails,
    handleResolve,
    handleReopen,
    handleDelete,
    handleSubmitOpinion,
    selectedIssue,
    setSelectedIssue,
  } = useIssueOperations();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshDetails();
  }, [refreshDetails]);

  if (!selectedIssue) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/workspace?issueId=${selectedIssue.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // We need currentUserName here for author actions and contribution check
  const hasAlreadyContributed = selectedIssue.opinions?.some(
    (opinion) => opinion.author === selectedIssue.author
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden h-fit max-h-[80vh] flex flex-col"
    >
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white flex-shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-tight truncate">{selectedIssue.title}</h3>
                {selectedIssue.isPrivate && <Lock size={12} className="text-rose-400/80" />}
              </div>
              <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Pipeline Concern Detail</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className={`p-2 rounded-lg transition-all ${
                copied 
                ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
              }`}
              title="Copy Share Link"
            >
              {copied ? <CheckCircle size={14} /> : <Share2 size={14} />}
            </button>

            {/* Author Actions */}
            <div className="flex items-center gap-2">
              {selectedIssue.status !== 'Resolved' ? (
                <button
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                  title="Resolve Issue"
                >
                  {isResolving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                </button>
              ) : (
                <button
                  onClick={handleReopen}
                  disabled={isReopening}
                  className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                  title="Reopen Issue"
                >
                  {isReopening ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                </button>
              )}
              <button
                onClick={() => handleDelete()}
                disabled={isDeleting}
                className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                title="Delete Issue"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-8">
          {/* AI Analysis Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/80">AI Consensus</h4>
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
                  Consensus forming… Needs {Math.max(0, 3 - (selectedIssue.opinions?.length || 0))} more opinions.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Description</h4>
            <p className="text-xs text-white/80 leading-relaxed text-wrap-balance">
              {selectedIssue.description}
            </p>
          </div>

          {/* Opinions */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} />
              Opinions ({selectedIssue.opinions?.length || 0})
            </h4>

            {/* In this sidebar view (My Issues), author probably won't comment on their own issue, 
                but we keep the logic for consistency if others could see it */}
            {hasAlreadyContributed ? (
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center border-dashed">
                <p className="text-[10px] text-emerald-400/80 font-mono uppercase tracking-widest leading-relaxed font-bold">
                  Contribution Submitted …
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitOpinion(selectedIssue.author);
                }} 
                className="relative"
              >
                <textarea
                  value={opinionText}
                  onChange={(e) => setOpinionText(e.target.value)}
                  placeholder="Share Perspective…"
                  className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none h-20"
                />
                <div className="flex items-center justify-between mt-1 px-1">
                  {error && <span className="text-[9px] text-red-400 font-medium">{error}</span>}
                  <div />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !opinionText.trim()}
                  className="absolute bottom-2 right-2 p-1.5 bg-white text-black rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {selectedIssue.opinions?.map((opinion) => (
                <div key={opinion.id} className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white/60">{opinion.author}</span>
                    <span className="text-[8px] font-mono text-white/20">{new Date(opinion.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-white/80 leading-relaxed">{opinion.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
