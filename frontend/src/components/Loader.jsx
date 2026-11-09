import React, { useState, useEffect } from 'react';

const LOADING_STATUSES = [
  'Initializing AI agent and reading context...',
  'Analyzing code structure & dependencies...',
  'Synthesizing key topics & technical slides...',
  'Formatting PPTX slide slides via PPTXGenJS...',
  'Rendering browser pages to compile high-quality PDF...',
  'Saving assets to temporary storage...',
  'Wrapping up final files for download...'
];

export default function Loader({ isLoading }) {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setStatusIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev < LOADING_STATUSES.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-xl mx-auto my-8 animate-fade-in">
      {/* Glow effect wrapper */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-8">
        {/* Pulsing background glow */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/25 blur-xl animate-pulse" />
        
        {/* Dual outer spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
        
        {/* Inner reverse spinner */}
        <div className="absolute inset-2 rounded-full border-4 border-t-pink-500 border-r-transparent border-b-purple-400 border-l-transparent animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
        
        {/* Center icon or dot */}
        <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#fff]" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-wide text-center">
        Generating Presentation
      </h3>
      
      {/* Sliding text display */}
      <div className="h-6 overflow-hidden flex items-center justify-center w-full">
        <p className="text-cyan-400 font-mono text-sm tracking-wide text-center animate-pulse">
          {LOADING_STATUSES[statusIdx]}
        </p>
      </div>

      {/* Tiny visual progress bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 transition-all duration-[2500ms] ease-out rounded-full"
          style={{ width: `${((statusIdx + 1) / LOADING_STATUSES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
