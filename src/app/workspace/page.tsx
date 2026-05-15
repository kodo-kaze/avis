'use client';

import React, { useState } from 'react';
import { Scene } from "@/components/ui/Marble";
import AnalysisForm from "@/components/workspace/AnalysisForm";
import ResultsView from "@/components/workspace/ResultsView";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';

export default function WorkspacePage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisResult(data);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      
      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Navigation Header */}
        <header className="w-full px-12 py-10 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-8">
             <Link href="/" className="group flex items-center gap-3 text-white/50 hover:text-white transition-all">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">AVIS ENGINE</span>
             </Link>
             <div className="h-6 w-[1px] bg-white/20" />
             <div className="flex items-center gap-3">
                <LayoutDashboard size={24} className="text-white" />
                <span className="font-black tracking-tighter text-2xl uppercase">Intelligence Workspace</span>
             </div>
          </div>
          <div className="p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-start justify-center p-8 md:p-12 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {!analysisResult ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-16 pt-12 md:pt-20 pb-20"
              >
                <div className="text-center space-y-6">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] py-4">
                    ORCHESTRATE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-white/40">INTELLIGENCE.</span>
                  </h1>
                  <p className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">
                    Automated Voice Insight System — Multi-Pipeline AI Analysis
                  </p>
                </div>
                
                <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />
              </motion.div>
            ) : (
              <div className="pt-10 w-full flex justify-center">
                <ResultsView key="results" data={analysisResult} onReset={handleReset} />
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer info */}
        <footer className="px-12 py-8 flex justify-between items-end pointer-events-none">
           <div className="space-y-1">
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Status</p>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-xs text-white/40 font-mono tracking-tight">AI PIPELINE READY</p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Avis Engine v1.0</p>
              <p className="text-xs text-white/40 font-mono">STAKEHOLDER-AI-NODE-01</p>
           </div>
        </footer>
      </div>
    </div>
  );
}
