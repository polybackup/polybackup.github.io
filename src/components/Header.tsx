import React, { useState } from 'react';
import { Compass, Home as HomeIcon, BarChart3, LogOut, ShieldAlert } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setScreen: (screen: ActiveScreen) => void;
  setSelectedGameId: (id: string | null) => void;
  isTeacherAuthed: boolean;
  setIsTeacherAuthed: (val: boolean) => void;
  onLockPortal: () => void;
}

export default function Header({ 
  activeScreen, 
  setScreen, 
  setSelectedGameId, 
  isTeacherAuthed, 
  setIsTeacherAuthed,
  onLockPortal
}: HeaderProps) {
  const [passcode, setPasscode] = useState('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigateTo = (screen: ActiveScreen) => {
    setSelectedGameId(null);
    setScreen(screen);
  };

  // Safe internal passcode gate check
  const handleAdminVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim().toLowerCase() === 'polybackup') {
      setIsTeacherAuthed(true);
      sessionStorage.setItem('physics4students_teacher_authed', 'true');
      setIsAdminLoginOpen(false);
      setPasscode('');
      setError(null);
      navigateTo('analytics');
    } else {
      setError('Invalid system core key.');
    }
  };

  const handleLogout = () => {
    setIsTeacherAuthed(false);
    sessionStorage.removeItem('physics4students_teacher_authed');
    if (activeScreen === 'analytics') {
      navigateTo('home');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-black/95 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Polybackup Brand Logo */}
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.45)]">
            P
          </div>
          <span className="font-display font-bold text-md sm:text-lg tracking-tight uppercase text-glow text-white">
            POLY<span className="text-brand-blue">BACKUP</span>
          </span>
        </button>

        {/* Navigation links for Games Portal */}
        <nav className="flex items-center gap-2 sm:gap-3 text-sm font-medium">
          <button
            onClick={() => navigateTo('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'home'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={() => navigateTo('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'games' || activeScreen === 'player'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Games Vault</span>
          </button>

          {/* Secured core admin panel tab */}
        {isTeacherAuthed ? (
          <button
            onClick={() => navigateTo('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'analytics'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Admin Panel</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setError(null);
              setPasscode('');
              setIsAdminLoginOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-zinc-500 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>
        )}

        {/* Teacher account sign out or simple close gate */}
        <div className="flex items-center gap-2 ml-2 pl-3 border-l border-slate-900">
          {isTeacherAuthed && (
            <button
              onClick={handleLogout}
              className="font-mono text-[10px] text-zinc-400 hover:text-zinc-200 uppercase bg-zinc-950 px-2 py-1 rounded border border-slate-800 transition-colors"
              title="Exit Admin"
            >
              Sign Out
            </button>
          )}
          
          <button
            onClick={onLockPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-955/25 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-rose-900/20 hover:border-rose-900/40 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            title="Lock Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock Portal</span>
          </button>
        </div>
      </nav>
    </div>

    {/* Standard password modal validation overlay */}
    {isAdminLoginOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <div 
          className="w-full max-w-sm bg-[#111111] border border-slate-850 rounded-xl p-6 space-y-5 shadow-2xl text-left"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1 text-center">
            <h4 className="font-display font-bold text-base text-zinc-100 uppercase tracking-tight">
              ADMIN PANEL LOGIN
            </h4>
            <p className="text-xs text-zinc-450 font-sans">
              Enter password to access game slot configuration.
            </p>
          </div>

          <form onSubmit={handleAdminVerifySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full bg-[#161618] border border-slate-800 focus:border-blue-500/50 text-white font-mono text-xs p-2.5 rounded-lg outline-none transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 text-[10.5px] font-mono bg-rose-950/20 p-2.5 rounded border border-rose-900/30">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAdminLoginOpen(false)}
                className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border border-slate-800 text-zinc-400 font-mono text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase tracking-wider rounded-lg font-bold cursor-pointer transition-colors text-glow"
              >
                Authorize
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </header>
  );
}
