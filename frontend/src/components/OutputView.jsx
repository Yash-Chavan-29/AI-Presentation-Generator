import React from 'react';
import { FileDown, FileText, ArrowLeft, Layers, Terminal } from 'lucide-react';

export default function OutputView({ data, onReset }) {
  if (!data) return null;

  const { explanation, pptxUrl, pdfUrl, slides } = data;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Back button and Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Generate another deck</span>
        </button>
        <span className="text-xs text-cyan-400 font-mono">Generation Complete</span>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PPTX Download */}
        <a
          href={pptxUrl}
          download
          className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-950/20 text-white transition-all duration-300 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg group-hover:scale-110 transition duration-300">
              <FileDown className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-100">Download PowerPoint</h4>
              <p className="text-xs text-slate-400">Export as editable .pptx slides</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-amber-500/10 text-amber-400 rounded group-hover:bg-amber-500 group-hover:text-white transition duration-300">
            PPTX
          </span>
        </a>

        {/* PDF Download */}
        <a
          href={pdfUrl}
          download
          className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-rose-500/30 hover:border-rose-500 hover:bg-rose-950/20 text-white transition-all duration-300 shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 text-rose-500 rounded-lg group-hover:scale-110 transition duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-100">Download PDF Document</h4>
              <p className="text-xs text-slate-400">Export as print-ready landscape PDF</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-rose-500/10 text-rose-400 rounded group-hover:bg-rose-500 group-hover:text-white transition duration-300">
            PDF
          </span>
        </a>
      </div>

      {/* Written Summary / Explanation */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Technical Summary & Explanation
        </h3>
        <div className="text-slate-300 text-sm leading-relaxed space-y-3 whitespace-pre-line font-light border-t border-white/5 pt-4">
          {explanation}
        </div>
      </div>

      {/* Slide Deck Live Previews */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Slide Deck Outline Preview ({slides.length} Slides)
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {slides.map((slide, i) => (
            <div 
              key={slide.id || i}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row hover:border-slate-700 transition duration-300"
            >
              {/* Slide Left: Info */}
              <div className="p-6 md:w-1/2 flex flex-col justify-between space-y-4 bg-slate-900/20">
                <div>
                  <div className="text-xs font-mono text-cyan-500 mb-1.5 uppercase tracking-wider">
                    Slide {i + 1}
                  </div>
                  <h4 className="text-xl font-bold text-slate-100 mb-4">
                    {slide.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {slide.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="text-slate-400 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-cyan-500 mt-1.5 shrink-0 block w-1.5 h-1.5 rounded-full" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Slide Right: Code Snippet */}
              {slide.codeSnippet && (
                <div className="p-4 md:w-1/2 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-mono">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>CODE PREVIEW</span>
                  </div>
                  <pre className="font-mono text-xs text-cyan-300/90 bg-black/60 p-4 rounded-xl overflow-x-auto flex-1 whitespace-pre max-h-60 md:max-h-none">
                    <code>{slide.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
