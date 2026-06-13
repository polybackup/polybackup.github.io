import React, { useState } from 'react';
import { ShieldAlert, BookOpen, Lock, Key, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    if (cleanUser === 'john' && cleanPass === 'pork') {
      onLoginSuccess();
      onClose();
      setError(null);
    } else {
      setError('Invalid district credentials. Please contact your coordinator.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative max-w-md w-full bg-[#0c0c0d] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#161618] hover:bg-slate-900 border border-slate-900 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-950/30 border border-blue-900/40 text-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-display font-black text-xl text-zinc-100 uppercase tracking-tight">
            PHYSICS PORTAL <span className="text-brand-blue">SIGN IN</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">
            Authorized Single Sign-On (SSO) login for physics teachers, district staff, and curriculum coordinators.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
              School Username *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter teacher ID or username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-[#161618] border border-slate-900 hover:border-slate-800 focus:border-blue-500/50 text-zinc-100 text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-mono"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
              Teacher Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter secure password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-[#161618] border border-slate-900 hover:border-slate-800 focus:border-blue-500/50 text-zinc-100 text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all font-mono"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-mono bg-rose-950/20 p-2.5 rounded border border-rose-900/30">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 animate-bounce" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer transition-colors"
          >
            <span>Verify School Access</span>
            <Lock className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo login suggestion (to aid inspection) */}
        <div className="p-3 bg-[#111111] border border-slate-900 rounded-lg text-left text-[10px] font-sans leading-relaxed text-zinc-500">
          <p className="font-semibold text-zinc-400 uppercase font-mono tracking-wider mb-1">
            // DISTRICT PORTAL HINT
          </p>
          <p>Please log in using username <code className="text-blue-400">john</code> and password <code className="text-blue-400">pork</code> to verify educational administrator status.</p>
        </div>
      </div>
    </div>
  );
}
