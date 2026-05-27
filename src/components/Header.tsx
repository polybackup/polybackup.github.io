import { Compass, FormInput, Home as HomeIcon, BarChart3 } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HeaderProps {
  activeScreen: ActiveScreen;
  setScreen: (screen: ActiveScreen) => void;
  setSelectedGameId: (id: string | null) => void;
}

export default function Header({ activeScreen, setScreen, setSelectedGameId }: HeaderProps) {
  const navigateTo = (screen: ActiveScreen) => {
    setSelectedGameId(null);
    setScreen(screen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-black/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo - Sleek Style */}
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.45)]">
            P
          </div>
          <span className="font-display font-bold text-lg tracking-tight uppercase text-white">
            POLY<span className="text-brand-blue">BACKUP</span>
          </span>
        </button>

        {/* Minimalist Navigation Links */}
        <nav className="flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => navigateTo('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'home'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => navigateTo('games')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'games' || activeScreen === 'player'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Library</span>
          </button>

          <button
            onClick={() => navigateTo('request')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'request'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <FormInput className="w-3.5 h-3.5" />
            <span>Request</span>
          </button>

          <button
            onClick={() => navigateTo('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeScreen === 'analytics'
                ? 'text-brand-blue bg-blue-950/20 border border-blue-900/40 text-glow'
                : 'text-zinc-400 hover:text-blue-500'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
