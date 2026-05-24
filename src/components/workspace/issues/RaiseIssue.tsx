'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Send, Loader2, AlertCircle, CheckCircle2, FileText, X, Clock, User as UserIcon, MessageSquare, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useWorkspaceStore } from '@/store/workspace.store';
import { createIssue, fetchMyIssues } from '@/services/workspace.service';

export default function RaiseIssue() {
  const { user } = useUser();
  const addIssue = useWorkspaceStore((state) => state.addIssue);
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [myIssues, setMyIssues] = useState<any[]>([]);
  const [isLoadingMyIssues, setIsLoadingMyIssues] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const authorName = user?.fullName || user?.username || 'Anonymous User';

  const loadMyIssues = async () => {
    if (!authorName) return;
    setIsLoadingMyIssues(true);
    try {
      const data = await fetchMyIssues(authorName);
      setMyIssues(data.map((item: any) => ({
        ...item,
        id: item.id.toString(),
        analysisResult: item.analysis_result,
        opinions: item.opinions?.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          issueId: o.issue_id.toString(),
        }))
      })));
    } catch (err) {
      console.error("Failed to load my issues", err);
    } finally {
      setIsLoadingMyIssues(false);
    }
  };

  useEffect(() => {
    loadMyIssues();
  }, [authorName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dbIssue = await createIssue({
        title,
        description: file ? `${description} (Attachment: ${file.name})` : description,
        author: authorName,
      });
      
      const newIssue = {
        id: dbIssue.id.toString(),
        title: dbIssue.title,
        description: dbIssue.description,
        status: dbIssue.status,
        createdAt: dbIssue.created_at,
        author: dbIssue.author,
      };

      addIssue(newIssue);
      setMyIssues(prev => [newIssue, ...prev]);

      setSuccess(true);
      setTitle('');
      setDescription('');
      setFile(null);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to transmit data to secure storage. Please check connectivity.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <AlertCircle className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Raise Concern</h2>
            <p className="text-white/40 text-xs font-mono tracking-widest uppercase">Direct Stakeholder Pipeline</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Issue Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Analysis latency in APAC region"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-medium text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none font-medium text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Supporting Documentation (Optional)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border border-dashed border-white/10 hover:border-white/30 rounded-xl p-4 transition-all bg-white/5 hover:bg-white/[0.08] flex items-center justify-center gap-3"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              {file ? (
                <div className="flex items-center gap-3 text-white">
                  <FileText size={18} className="text-white/60" />
                  <span className="text-xs font-medium">{file.name}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                  <Upload size={18} />
                  <span className="text-xs font-medium">Upload relevant logs or data</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
              <CheckCircle2 size={16} />
              Issue raised successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full bg-white text-black py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Transmitting Data...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Upload Issue</span>
              </>
            )}
          </button>
        </form>

        {/* MY ISSUES SECTION */}
        <div className="mt-12 space-y-6 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                <UserIcon size={18} className="text-white/60" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight">Your Pipeline Concerns</h3>
            </div>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{myIssues.length} ISSUES</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoadingMyIssues ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-white/20" size={24} />
              </div>
            ) : myIssues.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/5">
                <p className="text-white/20 font-mono text-xs uppercase tracking-widest">No issues raised yet</p>
              </div>
            ) : (
              myIssues.slice(0, 3).map((issue, idx) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedIssue(issue)}
                  className="group flex items-center justify-between p-5 bg-white/5 border border-white/5 hover:border-white/20 rounded-2xl transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        issue.status === 'Open' ? 'bg-red-500 animate-pulse' :
                        issue.status === 'Resolved' ? 'bg-emerald-500' :
                        'bg-amber-500'
                      }`} />
                      <h4 className="text-sm font-bold text-white group-hover:text-white transition-colors">{issue.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock size={10} /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><MessageSquare size={10} /> {issue.opinions?.length || 0} Opinions</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/10 group-hover:text-white/60 transition-colors translate-x-0 group-hover:translate-x-1" />
                </motion.div>
              ))
            )}
            {myIssues.length > 3 && (
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">Check &quot;All Issues&quot; for more</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
