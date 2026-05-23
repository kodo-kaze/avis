'use client';

import React, { useState } from 'react';
import { Scene } from "@/components/ui/Marble";
import AnalysisForm from "@/components/workspace/AnalysisForm";
import ResultsView from "@/components/workspace/ResultsView";
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import AllIssues from "@/components/workspace/issues/AllIssues";
import RaiseIssue from "@/components/workspace/issues/RaiseIssue";

export default function WorkspaceClient() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activePage, setActivePage] = useState("analysis");
  const handleAnalysisComplete = (data: AnalysisResult) => {
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
                <div className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
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
            <UserButton />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex items-start justify-center p-8 md:p-12 overflow-y-auto no-scrollbar">
          <div className="flex justify-center mb-6">
  <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
    
    <button
  onClick={() => setActivePage("issues")}
  className={`px-5 py-2 text-xs uppercase tracking-widest rounded-lg transition ${
    activePage === "issues"
      ? "bg-white text-black"
      : "text-white/50 hover:text-white"
  }`}
>
  All Issues
</button>

<button
  onClick={() => setActivePage("raise")}
  className={`px-5 py-2 text-xs uppercase tracking-widest rounded-lg transition ${
    activePage === "raise"
      ? "bg-white text-black"
      : "text-white/50 hover:text-white"
  }`}
>
  Raise Issue
</button>

  </div>
</div>
          <AnimatePresence mode="wait">
  {activePage === "analysis" ? (
    !analysisResult ? (
      <AnalysisForm onAnalysisComplete={handleAnalysisComplete} />
    ) : (
      <ResultsView
        data={analysisResult}
        onReset={handleReset}
      />
    )
  ) : activePage === "issues" ? (
    <AllIssues />
  ) : activePage === "raise" ? (
    <RaiseIssue />
  ) : null}
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
              <p className="text-xs text-white/40 font-mono">SYNAPSE-AI-NODE-01</p>
           </div>
        </footer>
      </div>
    </div>
  );
}
