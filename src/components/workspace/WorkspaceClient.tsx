'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AnalysisForm from "@/components/workspace/AnalysisForm";
import ResultsView from "@/components/workspace/ResultsView";
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { AnalysisResult } from '@/lib/types';

import AllIssues from "@/components/workspace/issues/AllIssues";
import RaiseIssue from "@/components/workspace/issues/RaiseIssue";
import PipelineConcerns from "@/components/workspace/issues/PipelineConcerns";
import PipelineIssueDetail from "@/components/workspace/issues/PipelineIssueDetail";
import IssueDetail from "@/components/workspace/issues/IssueDetail";
import About from "@/components/workspace/About";

import { useWorkspace } from '@/hooks/useWorkspace';

const Scene = dynamic(
  () => import("@/components/ui/Marble").then((mod) => mod.Scene),
  {
    ssr: false,
  }
);

export default function WorkspaceClient() {
  const {
    analysisResult,
    setAnalysisResult,
    resetWorkspace,
    selectedIssue,
    setSelectedIssue,
    selectionSource,
  } = useWorkspace();

  const [activePage, setActivePage] = useState("analysis");

  const handlePageChange = (page: string) => {
    setActivePage(page);
    setSelectedIssue(null);
  };

  const handleAnalysisComplete = (data: AnalysisResult) => {
    setAnalysisResult(data);
  };

  const handleReset = () => {
    resetWorkspace();
  };

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden text-white font-sans">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        {!analysisResult && <Scene />}
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        
        {/* Navigation Header */}
        <header className="w-full px-12 py-10 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-all"
            >
              <div className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                AVIS ENGINE
              </span>
            </Link>

            <div className="h-6 w-[1px] bg-white/20" />

            <div className="flex items-center gap-3">
              <LayoutDashboard size={24} className="text-white" />
              <span className="font-black tracking-tighter text-2xl uppercase">
                Intelligence Workspace
              </span>
            </div>
          </div>

          <div className="p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <UserButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center p-8 md:p-12 overflow-y-auto">

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">

              <button
                onClick={() => handlePageChange("analysis")}
                className={`px-5 py-2 text-xs uppercase tracking-widest rounded-lg transition ${
                  activePage === "analysis"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Analysis
              </button>

              <button
                onClick={() => handlePageChange("issues")}
                className={`px-5 py-2 text-xs uppercase tracking-widest rounded-lg transition ${
                  activePage === "issues"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                All Issues
              </button>

              <button
                onClick={() => handlePageChange("raise")}
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

          {/* Content */}
          <AnimatePresence mode="wait">
            {activePage === "analysis" ? (
              !analysisResult ? (
                <AnalysisForm
                  onAnalysisComplete={handleAnalysisComplete}
                />
              ) : (
                <ResultsView
                  data={analysisResult}
                  onReset={handleReset}
                />
              )
            ) : activePage === "issues" ? (
              selectedIssue ? (
                <IssueDetail onBack={() => setSelectedIssue(null)} />
              ) : (
                <AllIssues />
              )
            ) : activePage === "raise" ? (
              <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start justify-center">
                <RaiseIssue />
                {selectedIssue && selectionSource === 'pipeline' ? (
                  <PipelineIssueDetail />
                ) : (
                  <PipelineConcerns />
                )}
              </div>
            ) : activePage === "about" ? (
              <About />
            ) : null}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-12 py-8 flex justify-between items-end">
          <div className="space-y-1 pointer-events-none">
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
              Status
            </p>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />

              <p className="text-xs text-white/40 font-mono tracking-tight text-wrap-balance">
                AI PIPELINE READY
              </p>
            </div>
          </div>

          <div 
            onClick={() => handlePageChange("about")}
            className="text-right group cursor-pointer"
          >
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold group-hover:text-white/40 transition-colors">
              Avis Engine v1.0
            </p>

            <p className="text-xs text-white/40 font-mono group-hover:text-white transition-colors">
              SYNAPSE-AI-NODE-01
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}