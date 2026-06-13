import React from 'react';
import { ExternalLink, ClipboardList } from 'lucide-react';

export default function RequestForm() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 bg-[#050505] overflow-hidden animate-fadeIn">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6 bg-[#111111]/90 p-8 rounded-2xl border border-slate-900/80 backdrop-blur-md shadow-2xl">
        
        {/* Simple decorative emblem */}
        <div className="mx-auto w-12 h-12 bg-blue-950/20 border border-blue-900/40 text-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <ClipboardList className="w-5 h-5 text-blue-500" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[10.5px] text-blue-500 font-bold uppercase tracking-widest block">
            SUGGEST A TITLE
          </span>
          <h2 className="font-display font-black text-2xl text-zinc-150 uppercase tracking-tight">
            REQUEST NEW SLOT
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Suggest your favorite arcade titles or custom games. Feedback is reviewed regularly to deploy new active slots.
          </p>
        </div>

        {/* Dynamic call-to-action button */}
        <div className="pt-2">
          <a
            href="https://forms.gle/emVY7moXBEJ2bqoC7"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider transition-all font-bold shadow-lg hover:shadow-blue-500/20"
          >
            <span>Open Request Form</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
