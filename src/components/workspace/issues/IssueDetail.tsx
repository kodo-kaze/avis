'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Clock, MessageSquare, Send, Loader2, Trash2, CheckCircle, RotateCcw, Share2, Lock } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useIssueOperations } from '@/hooks/useIssueOperations';

interface IssueDetailProps {
  onBack: () => void;
}

export default function IssueDetail({ onBack }: IssueDetailProps) {
  const { user } = useUser();
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

  const currentUserName = user?.fullName || user?.username || 'Anonymous User';
  const hasAlreadyContributed = selectedIssue.opinions?.some(
    (opinion) => opinion.author === currentUserName
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-6xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                selectedIssue.status === 'Open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                selectedIssue.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {selectedIssue.status}
              </span>
              {selectedIssue.isPrivate && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-[9px] font-black uppercase tracking-widest">
                  <Lock size={10} /> Private
                </span>
              )}
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Issue ID: {selectedIssue.id}</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase text-wrap-balance">{selectedIssue.title}</h2>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              copied 
              ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {copied ? <CheckCircle size={16} /> : <Share2 size={16} />}
            <span>{copied ? 'Link Copied' : 'Share Link'}</span>
          </button>

          {/* Author Actions */}
          {currentUserName === selectedIssue.author && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              {selectedIssue.status !== 'Resolved' ? (
                <button
                  onClick={handleResolve}
                  disabled={isResolving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {isResolving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">Resolve</span>
                </button>
              ) : (
                <button
                  onClick={handleReopen}
                  disabled={isReopening}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                >
                  {isReopening ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                  <span className="text-[10px] font-black uppercase tracking-widest">Reopen</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(onBack)}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Content & Opinions */}
        <div className="space-y-8">
          
          {/* Main Content Card */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Issue Description</h3>
              <p className="text-white/90 leading-relaxed text-lg">
                {selectedIssue.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/60">
                <div className="p-2 bg-white/5 rounded-lg">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-bold">Author</p>
                  <p className="text-xs font-mono text-white/80">{selectedIssue.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/60">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-bold">Opened On</p>
                  <p className="text-xs font-mono text-white/80">
                    {new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Opinions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-wrap-balance">
                <MessageSquare className="text-white/40" size={24} />
                Stakeholder Opinions
                <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono text-white/40">
                  {selectedIssue.opinions?.length || 0}
                </span>
              </h3>
            </div>

            {/* Opinion Input */}
            {hasAlreadyContributed ? (
              <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center border-dashed">
                <p className="text-emerald-400/80 text-xs font-mono uppercase tracking-[0.2em] font-bold">
                  Perspective Shared …
                </p>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">
                  You have already contributed to this issue.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitOpinion(currentUserName);
                }} 
                className="relative group"
              >
                <textarea
                  value={opinionText}
                  onChange={(e) => setOpinionText(e.target.value)}
                  placeholder="Share your perspective on this issue…"
                  className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none font-medium h-32"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                  {error && <span className="text-xs text-red-400 font-medium">{error}</span>}
                  <button
                    type="submit"
                    disabled={isSubmitting || !opinionText.trim()}
                    className="bg-white text-black px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                    Submit Opinion
                  </button>
                </div>
              </form>
            )}

            {/* Opinion List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedIssue.opinions?.map((opinion, idx) => (
                  <motion.div
                    key={opinion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 space-y-3 relative overflow-hidden group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                          {opinion.author[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-white/60">{opinion.author}</span>
                      </div>
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                        {new Date(opinion.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {opinion.text}
                    </p>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/5 group-hover:bg-white/20 transition-all" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!selectedIssue.opinions || selectedIssue.opinions.length === 0) && (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/5">
                  <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Waiting for stakeholder input</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
