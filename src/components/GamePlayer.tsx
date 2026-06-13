import { useState, useRef, useEffect } from 'react';
import { Game } from '../types';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

export default function GamePlayer({ game, onBack }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reset loading spinner on game change
  useEffect(() => {
    setIsLoading(true);
  }, [game]);

  return (
    <div 
      id="polytrack-player-workspace"
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col select-none"
    >
      {/* Header Toolbar Controls - ONLY Back button and Game Name as requested */}
      <div className="w-full h-16 flex items-center justify-between px-4 bg-[#111111] border-b border-zinc-900 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-slate-800 text-zinc-350 hover:text-blue-500 hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
            title="Exit to Games Vault"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-sm tracking-wide text-zinc-100 uppercase flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-blue-500 animate-pulse" />
              {game.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Primary Game Iframe Viewport Container */}
      <div className="flex-1 w-full relative">
        {/* Dynamic Loading Overlay spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0a0a0a] z-30 flex flex-col items-center justify-center space-y-4 font-mono">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin" />
              <div className="absolute w-6 h-6 flex items-center justify-center">
                <Gamepad2 className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-display font-semibold text-xs text-zinc-300 uppercase tracking-widest leading-none">
                LOADING
              </p>
              <p className="text-[10px] text-zinc-550 uppercase mt-1.5">
                Starting game components...
              </p>
            </div>
          </div>
        )}

        {/* The Game Iframe */}
        <iframe
          ref={iframeRef}
          src={game.iframeUrl}
          title={game.title}
          className="w-full h-full border-none bg-black select-none"
          allow="autoplay; fullscreen; keyboard; gamepad; clipboard-write; clipboard-read"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  );
}
