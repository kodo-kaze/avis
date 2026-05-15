'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  Hash, 
  Layers, 
  Image as ImageIcon,
  ArrowLeft,
  Smile,
  Meh,
  Frown
} from 'lucide-react';

interface ResultsViewProps {
  data: any;
  onReset: () => void;
}

export default function ResultsView({ data, onReset }: ResultsViewProps) {
  const { summary, sentiment_distribution, sentiments, topics, keywords, wordcloud_url } = data;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl pb-32 px-4"
    >
      <div className="flex justify-between items-center mb-16 pt-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">ANALYSIS RESULTS</h2>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] mt-2 font-black">AI Orchestration complete • Nodes active</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full hover:bg-neutral-200 transition-all text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <ArrowLeft size={16} /> NEW ANALYSIS
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & Sentiment */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 text-white/60">
              <MessageSquare size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">AI Executive Summary</h3>
            </div>
            <p className="text-xl leading-relaxed text-neutral-200 font-medium">
              "{summary}"
            </p>
          </section>

          {/* Sentiment Distribution */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8 text-white/60">
              <BarChart3 size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Sentiment Intelligence</h3>
            </div>
            
            <div className="flex items-end gap-2 h-48 mb-8">
              <div className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${sentiment_distribution.positive}%` }} 
                  className="w-full bg-emerald-500/80 rounded-t-xl relative group"
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-emerald-400">
                    {sentiment_distribution.positive}%
                  </span>
                </motion.div>
                <Smile className="text-emerald-500" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${sentiment_distribution.neutral}%` }} 
                  className="w-full bg-blue-500/80 rounded-t-xl relative group"
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-blue-400">
                    {sentiment_distribution.neutral}%
                  </span>
                </motion.div>
                <Meh className="text-blue-500" />
              </div>
              <div className="flex-1 flex flex-col items-center gap-4">
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${sentiment_distribution.negative}%` }} 
                  className="w-full bg-rose-500/80 rounded-t-xl relative group"
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-bold text-rose-400">
                    {sentiment_distribution.negative}%
                  </span>
                </motion.div>
                <Frown className="text-rose-500" />
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-4 no-scrollbar">
              {sentiments.map((s: any, i: number) => (
                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 text-sm">
                   <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                     s.label === 'POSITIVE' ? 'bg-emerald-500' : 
                     s.label === 'NEGATIVE' ? 'bg-rose-500' : 'bg-blue-500'
                   }`} />
                   <p className="text-white/70 italic">"{s.comment}"</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Topics, Keywords, Wordcloud */}
        <div className="space-y-6">
          {/* Discovery: Topics */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 text-white/60">
              <Layers size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Discovered Topics</h3>
            </div>
            <div className="space-y-4">
              {topics.map((t: any, i: number) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-white/80">{t.topic}</span>
                    <span className="text-xs font-mono text-white/40">{t.count} items</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: i * 0.1 }}
                      className="h-full bg-white/40 group-hover:bg-white transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Keywords */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 text-white/60">
              <Hash size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Key Themes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/80 border border-white/5">
                  {kw}
                </span>
              ))}
            </div>
          </section>

          {/* WordCloud */}
          {wordcloud_url && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6 text-white/60">
                <ImageIcon size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Visual Synthesis</h3>
              </div>
              <div className="rounded-2xl overflow-hidden bg-white/10 aspect-video flex items-center justify-center">
                <img 
                  src={wordcloud_url} 
                  alt="Word Cloud" 
                  className="w-full h-full object-contain mix-blend-screen opacity-80"
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
