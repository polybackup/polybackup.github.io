import React, { useState } from 'react';
import { MessageSquarePlus, ExternalLink, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RequestForm() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game name title');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          details: details.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Server declined suggestion record.');
      }

      setIsSuccess(true);
      setTitle('');
      setDetails('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to log proposal on arcade backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 bg-[#050505] overflow-hidden">
      {/* Background Mesh */}
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6 animate-fadeIn">
        
        {/* Decorative dynamic header emblem */}
        <div className={`mx-auto w-14 h-14 bg-blue-950/40 border ${isSuccess ? 'border-emerald-500/40 text-emerald-400' : 'border-blue-900/50 text-brand-blue'} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.15)]`}>
          {isSuccess ? <CheckCircle2 className="w-6 h-6" /> : <MessageSquarePlus className="w-6 h-6 animate-pulse" />}
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-brand-blue font-semibold tracking-widest uppercase">
            Suggest a Slot
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
            REQUEST A <span className="text-brand-blue">GAME</span>
          </h2>
          <p className="text-sm text-slate-400 font-sans leading-relaxed">
            Missing your favorite title? Request a game below! Our administrators will review the list and load unblocked slots.
          </p>
        </div>

        {/* Dynamic interactive Suggestion Form Container */}
        <div className="bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 backdrop-blur-md text-left">
          {isSuccess ? (
            <div className="space-y-4 text-center py-4 animate-fadeIn">
              <h3 className="font-display font-bold text-sm text-emerald-400 uppercase tracking-wider">
                Request Logged Successfully
              </h3>
              <p className="font-mono text-[11px] text-zinc-400 leading-relaxed uppercase">
                // System telemetry recorded: status is set to raw "Pending" for review.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-2 text-xs font-mono text-blue-400 hover:text-blue-300 uppercase underline cursor-pointer"
              >
                Submit another recommendation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Game Title slots input */}
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                  Game Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Run 3, Slope, Retro Bowl..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full bg-[#161618] border border-slate-850/80 border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500/50 transition-colors font-mono"
                />
              </div>

              {/* Extra details description input */}
              <div className="space-y-1">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                  Supporting details / Specific version links
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us what platform, specific request hooks or features you prefer..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#161618] border border-slate-850/80 border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500/50 transition-colors font-mono resize-none"
                />
              </div>

              {/* Display custom warnings */}
              {error && (
                <div className="flex items-center gap-2 text-rose-455 text-rose-500 text-[10px] font-mono bg-rose-950/20 p-2.5 rounded border border-rose-900/30">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Native Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_4px_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Logging Telemetry...' : 'Submit game request'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Backwards-compatibility Google Forms Anchor link option */}
        <div className="flex flex-col items-center justify-center space-y-2 pt-2 border-t border-slate-900/60 max-w-xs mx-auto">
          <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            // Preferred external feedback?
          </p>
          <a
            href="https://forms.gle/emVY7moXBEJ2bqoC7"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-blue-400 font-mono text-[10px] uppercase transition-colors"
          >
            <span>Launch Original Google Form</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
