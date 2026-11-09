import React, { useState } from 'react';
import { Terminal, Send, Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: 'Custom React Hook',
    prompt: 'Explain React state management and create a custom hook for handling localStorage persistence.',
    code: `import { useState, useEffect } from 'react';\n\nexport function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const jsonValue = localStorage.getItem(key);\n    if (jsonValue != null) return JSON.parse(jsonValue);\n    return initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}`
  },
  {
    title: 'Express Route Guard',
    prompt: 'Describe the role of middleware in Express and demonstrate custom JWT authentication token parsing.',
    code: `const jwt = require('jsonwebtoken');\n\nfunction authenticateToken(req, res, next) {\n  const authHeader = req.headers['authorization'];\n  const token = authHeader && authHeader.split(' ')[1];\n\n  if (token == null) return res.sendStatus(401);\n\n  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {\n    if (err) return res.sendStatus(403);\n    req.user = user;\n    next();\n  });\n}`
  }
];

export default function InputForm({ onSubmit, disabled }) {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt, code });
  };

  const applySuggestion = (sug) => {
    if (disabled) return;
    setPrompt(sug.prompt);
    setCode(sug.code);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Suggestions block */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Quick templates to get started:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => applySuggestion(sug)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:border-cyan-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
            >
              {sug.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Presentation Prompt */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300">
            Presentation Prompt <span className="text-pink-500">*</span>
          </label>
          <textarea
            id="prompt"
            rows="3"
            required
            disabled={disabled}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Describe the benefits of asynchronous code execution and explain the event loop..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-300 disabled:opacity-50"
          />
        </div>

        {/* Source Code Snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="code" className="block text-sm font-medium text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Source Code (Optional)
            </label>
            <span className="text-xs text-slate-500">Paste syntax for side-by-side comparison</span>
          </div>
          <div className="relative">
            <textarea
              id="code"
              rows="8"
              disabled={disabled}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your functions, classes or setup scripts here..."
              className="w-full font-mono text-sm px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={disabled || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.99] transition-all duration-300 shadow-lg shadow-cyan-500/10 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
          >
            <Send className="w-4 h-4" />
            Generate Presentation and Explanation
          </button>
        </div>
      </form>
    </div>
  );
}
