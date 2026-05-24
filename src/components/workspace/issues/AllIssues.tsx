'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, AlertCircle, CheckCircle2, MoreVertical, Search, Filter } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspace.store';

export default function AllIssues() {
  const issues = useWorkspaceStore((state) => state.issues);

  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase">Stakeholder Issues</h2>
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mt-1">
            {issues.length} Active Concern{issues.length !== 1 ? 's' : ''} in Pipeline
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Filter issues..."
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-white/30 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
            <Filter size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Issues Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {issues.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
            <AlertCircle className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No issues found in pipeline</p>
          </div>
        ) : (
          issues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                      issue.status === 'Open' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      issue.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {issue.status}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-white transition-colors">
                      {issue.title}
                    </h3>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed max-w-3xl">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-white/30">
                      <User size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-wider">{issue.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/30">
                      <Clock size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-wider">
                        {new Date(issue.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Status indicator line */}
              <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full ${
                issue.status === 'Open' ? 'bg-red-500/50' :
                issue.status === 'Resolved' ? 'bg-emerald-500/50' :
                'bg-amber-500/50'
              }`} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
