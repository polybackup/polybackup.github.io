import { MessageSquarePlus, ExternalLink } from 'lucide-react';

export default function RequestForm() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 bg-[#050505] overflow-hidden">
      {/* Background Mesh */}
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6 animate-fadeIn">
        {/* Simple decorative icon */}
        <div className="mx-auto w-14 h-14 bg-blue-950/40 border border-blue-900/50 text-brand-blue rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-2 animate-pulse">
          <MessageSquarePlus className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-brand-blue font-semibold tracking-widest uppercase">
            Suggest a Title
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
            REQUEST A <span className="text-brand-blue">GAME</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Missing your favorite game? Just tell us the name of the game and we'll add it to the library. No codes or files needed!
          </p>
        </div>

        <div className="pt-4 max-w-xs mx-auto">
          <a
            href="https://forms.gle/emVY7moXBEJ2bqoC7"
            target="_blank"
            rel="noreferrer"
            className="group relative w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
          >
            <span>Request Game Form</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <span className="block font-mono text-[9px] text-zinc-600 uppercase tracking-widest pt-4">
          // Redirects directly to google forms
        </span>
      </div>
    </div>
  );
}
