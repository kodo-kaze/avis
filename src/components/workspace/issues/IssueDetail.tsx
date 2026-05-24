'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Clock, MessageSquare, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useWorkspaceStore } from '@/store/workspace.store';
import { createOpinion, fetchIssueDetails } from '@/services/workspace.service';
import ResultsView from '@/components/workspace/ResultsView';

interface IssueDetailProps {
  onBack: () => void;
}

export default function IssueDetail({ onBack }: IssueDetailProps) {
  const { user } = useUser();
  const selectedIssue = useWorkspaceStore((state) => state.selectedIssue);
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  
  const [opinionText, setOpinionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshDetails = async () => {
    if (!selectedIssue) return;
    setIsLoadingDetails(true);
    try {
      const data = await fetchIssueDetails(selectedIssue.id);
      setSelectedIssue({
        ...data,
        id: data.id.toString(),
        analysisResult: data.analysis_result,
        opinions: data.opinions.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          issueId: o.issue_id.toString(),
        }))
      });
    } catch (err) {
      console.error("Failed to refresh issue details", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    refreshDetails();
  }, []);

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
      await refreshDetails(); // Refresh to show new opinion and potential AI result
    } catch (err) {
      setError('Failed to submit opinion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedIssue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-6xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-6">
        <button
          onClick={onBack}
          className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white"
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
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">Issue ID: {selectedIssue.id}</p>
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase">{selectedIssue.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Opinions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Content Card */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Issue Description</h3>
              <p className="text-white/80 leading-relaxed text-lg">
                {selectedIssue.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/40">
                <div className="p-2 bg-white/5 rounded-lg">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-bold">Author</p>
                  <p className="text-xs font-mono">{selectedIssue.author}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white/40">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest font-bold">Opened On</p>
                  <p className="text-xs font-mono">
                    {new Date(selectedIssue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Opinions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="text-white/40" size={24} />
                Stakeholder Opinions
                <span className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[10px] font-mono text-white/40">
                  {selectedIssue.opinions?.length || 0}
                </span>
              </h3>
            </div>

            {/* Opinion Input */}
            <form onSubmit={handleSubmitOpinion} className="relative group">
              <textarea
                value={opinionText}
                onChange={(e) => setOpinionText(e.target.value)}
                placeholder="Share your perspective on this issue..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none font-medium h-32"
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

            {/* Opinion List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedIssue.opinions?.map((opinion, idx) => (
                  <motion.div
                    key={opinion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-3 relative overflow-hidden group"
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

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">AI Consensus</h3>
          </div>

          <div className="sticky top-8">
            {user?.fullName === selectedIssue.author || user?.username === selectedIssue.author ? (
              selectedIssue.analysisResult ? (
                <ResultsView
                  data={selectedIssue.analysisResult}
                  onReset={() => {}}
                  hideHeader={true}
                />
              ) : (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center space-y-6">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-white/5 rounded-full animate-ping" />
                    <div className="relative flex items-center justify-center w-20 h-20 bg-white/10 rounded-full border border-white/10">
                      <Loader2 className="animate-spin text-white/40" size={32} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white font-bold uppercase tracking-widest text-xs">Waiting for Threshold</p>
                    <p className="text-white/30 text-[10px] font-mono uppercase leading-relaxed">
                      AI Analysis triggers automatically after <span className="text-white/60">3 stakeholder opinions</span>.
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                      <span>Consensus Progress</span>
                      <span>{selectedIssue.opinions?.length || 0} / 3</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white/40"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((selectedIssue.opinions?.length || 0) / 3) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center space-y-6">
                <div className="flex items-center justify-center w-20 h-20 bg-white/5 rounded-full border border-white/10 mx-auto">
                  <AlertCircle className="text-white/20" size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold uppercase tracking-widest text-xs">Private Intelligence</p>
                  <p className="text-white/30 text-[10px] font-mono uppercase leading-relaxed">
                    Detailed AI analysis results are exclusively visible to the <span className="text-white/60">Issue Author</span>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
