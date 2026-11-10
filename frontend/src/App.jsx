import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import OutputView from './components/OutputView';
import { generatePresentation } from './services/api';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async ({ prompt, code }) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await generatePresentation(prompt, code);
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'An error occurred during generation.');
      }
    } catch (err) {
      console.error('[Generate Handler] Error:', err);
      setError(err.message || 'Failed to connect to the backend server. Please verify it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background Mesh Gradients */}
      <div className="bg-mesh" />

      {/* Futuristic Sticky Header */}
      <header className="sticky top-0 z-50 bg-dark-900/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 transition duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Glowing Logo */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SlideCraft <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Presentation Studio</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 border border-white/5 px-3 py-1.5 rounded-full font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>v1.0.0 (Active)</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 relative z-10 flex flex-col justify-center">
        
        {/* Intro Hero Section (Visible when not viewing output or loading) */}
        {!result && !isLoading && (
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Turn Source Code into{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent">
                Stunning Slide Decks
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">
              Paste your script file, input an explanation prompt, and our AI will instantly assemble a structured, visual slideshow alongside download links for PowerPoint & PDF.
            </p>
          </div>
        )}

        {/* Error Alert Display */}
        {error && (
          <div className="max-w-4xl mx-auto w-full mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Generation Failed</h4>
              <p className="text-xs text-rose-300/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Dynamic Panels */}
        {!result && !isLoading ? (
          <InputForm onSubmit={handleGenerate} disabled={isLoading} />
        ) : isLoading ? (
          <Loader isLoading={isLoading} />
        ) : (
          <OutputView data={result} onReset={handleReset} />
        )}
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="border-t border-white/5 bg-dark-900/40 py-6 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SlideCraft AI. All rights reserved.</p>
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-600">
            <span>React (Vite)</span>
            <span>•</span>
            <span>Tailwind v3</span>
            <span>•</span>
            <span>Node.js Express</span>
            <span>•</span>
            <span>Puppeteer & PPTXGenJS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
