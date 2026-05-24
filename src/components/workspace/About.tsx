'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Layers,
  Database,
  Globe,
  ArrowLeft
} from 'lucide-react';

interface AboutProps {
  onBack?: () => void;
}

export default function About({ onBack }: AboutProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-5xl space-y-12 pb-24"
    >
      {/* Back Button */}
      {onBack && (
        <div className="flex justify-start">
          <button
            onClick={onBack}
            className="group flex items-center gap-3 text-white/40 hover:text-white transition-all"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Return to Workspace</span>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          <Info size={12} /> System Information
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-wrap-balance">
          AVIS ENGINE <span className="text-white/20">V1.0</span>
        </h2>
        <p className="text-xl text-white/60 font-medium max-w-2xl mx-auto text-wrap-pretty leading-relaxed">
          An AI‑Driven Stakeholder Insight Platform designed to orchestrate complex feedback analysis through high‑dimensional visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SYNAPSE-AI Architecture */}
        <motion.div 
          variants={itemVariants}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">SYNAPSE‑AI</h3>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Neural Orchestration Layer</p>
            </div>
          </div>
          <p className="text-white/70 leading-relaxed font-medium">
            At the core of AVIS lies SYNAPSE‑AI, a modular orchestration service that leverages state‑of‑the‑art transformer models for multi‑stage text processing. 
          </p>
          <ul className="space-y-4 pt-2">
            {[
              { icon: <Zap size={16} />, title: "Real-time Processing", desc: "Low-latency inference via optimized API pipelines." },
              { icon: <ShieldCheck size={16} />, title: "Secure Transmission", desc: "End-to-end encryption for all stakeholder feedback data." },
              { icon: <Globe size={16} />, title: "Global Context", desc: "Multilingual support for diverse stakeholder regions." }
            ].map((feature, i) => (
              <li key={i} className="flex gap-4 items-start">
                <div className="mt-1 text-white/40">{feature.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed mt-0.5">{feature.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Core Capabilities */}
        <motion.div 
          variants={itemVariants}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">Core Capabilities</h3>
              <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">Advanced Data Synthesis</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-2">
            {[
              { icon: <MessageSquare size={18} />, title: "Sentiment Intelligence", desc: "Granular distribution analysis of stakeholder emotions and perspectives." },
              { icon: <Layers size={18} />, title: "Topic Discovery", desc: "Automated extraction of key themes using unsupervised clustering techniques." },
              { icon: <Database size={18} />, title: "Churn Risk Model", desc: "Powered by XGBoost to identify potential stakeholder disengagement with high precision." }
            ].map((cap, i) => (
              <div key={i} className="flex items-center gap-5 p-4 bg-white/5 border border-white/5 rounded-2xl">
                <div className="p-2 bg-white/5 rounded-lg text-white/60">{cap.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{cap.title}</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech Stack Footer */}
      <motion.div 
        variants={itemVariants}
        className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 text-center space-y-8"
      >
        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30">System Infrastructure Stack</h3>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
          {[
            "Next.js 16 (Turbopack)",
            "TypeScript",
            "Tailwind CSS 4",
            "FastAPI",
            "SQLAlchemy",
            "Hugging Face API",
            "Clerk Auth"
          ].map((tech, i) => (
            <span key={i} className="text-xs font-mono font-bold uppercase tracking-widest text-white hover:text-white transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* System Signature */}
      <div className="flex flex-col items-center gap-2 pt-12 opacity-20">
        <p className="text-[9px] font-mono uppercase tracking-[0.5em]">SYNAPSE-AI-NODE-01 SIGNATURE AUTHENTICATED</p>
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
    </motion.div>
  );
}
