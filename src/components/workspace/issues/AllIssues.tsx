'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, AlertCircle, MoreVertical, Search, Filter, Loader2, X, ChevronDown } from 'lucide-react';
import { useWorkspaceStore } from '@/store/workspace.store';
import { fetchIssues } from '@/services/workspace.service';

export default function AllIssues() {
  const issues = useWorkspaceStore((state) => state.issues);
  const setIssues = useWorkspaceStore((state) => state.setIssues);
  const setSelectedIssue = useWorkspaceStore((state) => state.setSelectedIssue);
  const [loading, setLoading] = useState(issues.length === 0);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Resolved' | 'Pending'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchIssues();
        setIssues(data);
      } catch (error) {
        console.error("Failed to load issues:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setIssues]);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-5xl space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-wrap-balance">Stakeholder Issues</h2>
          <p className="text-white/50 text-xs font-mono tracking-widest uppercase mt-1">
            {filteredIssues.length} Concern{filteredIssues.length !== 1 ? 's' : ''} Matched
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto relative">
          {loading && <Loader2 size={16} className="animate-spin text-white/40" />}
          
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-xs focus:outline-none focus:border-white/30 focus-visible:ring-1 focus-visible:ring-white/20 transition-all w-full md:w-64"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${
                statusFilter !== 'All' 
                  ? 'bg-white/10 border-white/40 text-white' 
                  : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <Filter size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{statusFilter}</span>
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl"
                >
                  {(['All', 'Open', 'Pending', 'Resolved'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5 ${
                        statusFilter === status ? 'text-white bg-white/10' : 'text-white/40'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Issues Grid/List */}
      <div className="grid grid-cols-1 gap-4">
        {loading && issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-black/60 backdrop-blur-xl rounded-[2rem] border border-dashed border-white/10">
            <Loader2 className="animate-spin text-white/40 mb-4" size={48} />
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Accessing Secure Vault…</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-20 bg-black/60 backdrop-blur-xl rounded-[2rem] border border-dashed border-white/10">
            <AlertCircle className="mx-auto text-white/20 mb-4" size={48} />
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest">
              {issues.length === 0 ? 'No Issues Found in Pipeline' : 'No Results Match Your Filters'}
            </p>
            {issues.length > 0 && (
              <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          filteredIssues.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedIssue(issue, 'all')}
              className="group relative bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/40 rounded-2xl p-6 transition-all cursor-pointer hover:translate-x-1"
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
                    <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-white transition-colors text-wrap-balance">
                      {issue.title}
                    </h3>
                  </div>

                  <p className="text-white/80 text-sm leading-relaxed max-w-3xl">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-white/50">
                      <User size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-wider">{issue.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/50">
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
                  <button className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all">
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
