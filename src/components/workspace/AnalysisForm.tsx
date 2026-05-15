'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Send, Loader2, X } from 'lucide-react';

interface AnalysisFormProps {
  onAnalysisComplete: (data: any) => void;
}

export default function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = 'http://localhost:8000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (activeTab === 'upload' && file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });
      } else if (activeTab === 'text' && text.trim()) {
        response = await fetch(`${API_BASE}/analyze-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
      } else {
        throw new Error('Please provide a file or text to analyze.');
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Analysis failed.');
      }

      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl bg-black/60 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_30px_rgba(255,255,255,0.05)]"
    >
      <div className="flex gap-4 mb-10 p-1.5 bg-white/5 rounded-2xl border border-white/5">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
            activeTab === 'upload' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Upload File</span>
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${
            activeTab === 'text' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Paste Text</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'upload' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer border-2 border-dashed border-white/10 hover:border-white/30 rounded-2xl p-12 transition-all bg-white/5 hover:bg-white/[0.08]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".csv,.json,.txt"
            />
            <div className="flex flex-col items-center gap-4 text-center">
              {file ? (
                <>
                  <div className="p-4 bg-white/10 rounded-full text-white">
                    <FileText size={32} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-white/40 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-white/10 rounded-full text-white/40 group-hover:text-white transition-colors">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Click to select file</p>
                    <p className="text-white/40 text-sm">Supports CSV, JSON, TXT</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your stakeholder comments here (one per line)..."
            className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all resize-none font-mono text-sm"
          />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl p-4 flex justify-between items-center"
          >
            {error}
            <button onClick={() => setError(null)}><X size={14} /></button>
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading || (activeTab === 'upload' ? !file : !text.trim())}
          className="w-full bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>PROCESSING AI MODELS...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>RUN ANALYSIS</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
