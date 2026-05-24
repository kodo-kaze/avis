'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Clock, User as UserIcon, MessageSquare, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useWorkspaceStore } from '@/store/workspace.store';
import { fetchMyIssues } from '@/services/workspace.service';
import { Issue } from '@/types/workspace.types';
import { AnalysisResult } from '@/lib/types';

export default function PipelineConcerns() {
  const { user } = useUser();
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  const issues = useWorkspaceStore((state) => state.issues);
  const setIssues = useWorkspaceStore((state) => state.setIssues);
  
  const [isLoading, setIsLoading] = useState(false);

  const authorName = user?.fullName || user?.username || 'Anonymous User';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!authorName) return;
      setIsLoading(true);
      try {
        const data = await fetchMyIssues(authorName);
        const formattedIssues: Issue[] = data.map((item: { 
          id: number | string; 
          title: string; 
          description: string; 
          status: 'Open' | 'Resolved' | 'Pending';
          created_at: string;
          author: string;
          analysis_result?: AnalysisResult;
          opinions?: { id: number | string; issue_id: number | string; text: string; author: string; created_at: string }[] 
        }) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.description,
          status: item.status,
          createdAt: item.created_at,
          author: item.author,
          analysisResult: item.analysis_result,
          opinions: item.opinions?.map((o) => ({
            id: o.id.toString(),
            issueId: o.issue_id.toString(),
            text: o.text,
            author: o.author,
            createdAt: o.created_at
          }))
        }));
        if (mounted) {
          setIssues(formattedIssues);
        }
      } catch (err) {
        console.error("Failed to load my issues", err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [authorName, setIssues]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden h-fit"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <UserIcon size={18} className="text-white/60" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">Your Pipeline Concerns</h3>
          </div>
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{issues.length} ISSUES</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-white/20" size={24} />
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/5">
              <p className="text-white/20 font-mono text-xs uppercase tracking-widest">No issues raised yet</p>
            </div>
          ) : (
            issues.slice(0, 5).map((issue, idx) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedIssue(issue, 'pipeline')}
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
          {issues.length > 5 && (
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20">Check &quot;All Issues&quot; for more</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
