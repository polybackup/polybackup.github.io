import { useState, useRef, useEffect } from 'react';
import { Game } from '../types';
import { ArrowLeft, RefreshCw, Maximize2, Server, HelpCircle, Gamepad2, Info, MonitorCheck } from 'lucide-react';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

export default function GamePlayer({ game, onBack }: GamePlayerProps) {
  const [activeMirror, setActiveMirror] = useState(game.iframeUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [showHUD, setShowHUD] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync active mirrors correctly if game changes
  useEffect(() => {
    setActiveMirror(game.iframeUrl);
    setIsLoading(true);
    setShowHUD(true);
  }, [game]);

  // Reload the iframe
  const reloadGame = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = activeMirror;
    }
  };

  // Select Mirror
  const selectMirror = (url: string) => {
    if (url === activeMirror) return;
    setIsLoading(true);
    setActiveMirror(url);
  };

  // Native Fullscreen API Toggle
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn("Fullscreen request denied: ", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Sync fullscreen state changes from keyboard shortcuts ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      id="polytrack-player-workspace"
      ref={playerContainerRef}
      className="relative w-full h-screen bg-black overflow-hidden flex flex-col select-none"
    >
      {/* 1. Header Toolbar Controls overlay */}
      <div className={`absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-gradient-to-b from-black/95 via-black/75 to-transparent transition-transform duration-300 ${showHUD ? 'translate-y-0' : '-translate-y-full hover:translate-y-0'}`}>
        {/* Navigation & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#111111]/90 border border-slate-900 text-zinc-300 hover:text-blue-500 hover:border-blue-500/40 transition-all duration-200 cursor-pointer"
            title="Exit to Games Portal"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col">
            <h3 className="font-display font-black text-sm tracking-wide text-zinc-100 uppercase flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-brand-blue" />
              {game.title}
            </h3>
            <span className="font-mono text-[9px] text-brand-blue/80 uppercase tracking-widest">
              Running Unblocked Channel Frame
            </span>
          </div>
        </div>

        {/* Immersive Floating Utility Bar */}
        <div className="flex items-center gap-2 bg-[#111111]/95 border border-slate-900 px-2.5 py-1.5 rounded-xl backdrop-blur-md">
          {/* Mirror Selector */}
          {game.mirrors.length > 0 && (
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-2 mr-2">
              <span className="font-mono text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                <Server className="w-3 h-3 text-brand-blue" />
                Mirror:
              </span>
              <div className="flex gap-1">
                {game.mirrors.map((mirror, index) => (
                  <button
                    key={index}
                    onClick={() => selectMirror(mirror.url)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-tighter transition-all cursor-pointer ${
                      activeMirror === mirror.url
                        ? 'bg-blue-600 text-white font-bold shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                        : 'bg-[#161618] text-zinc-400 hover:text-zinc-200 hover:bg-slate-800'
                    }`}
                    title={mirror.name}
                  >
                    M{index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Refresh/Reload Button */}
          <button
            onClick={reloadGame}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reload Iframe Buffer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Full Screen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen Mode" : "Maximize to Desktop Fullscreen"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Primary Game Iframe Viewport Container */}
      <div className="flex-1 w-full h-full relative">
        {/* Dynamic Loading Overlay spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black z-30 flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-lg border border-blue-900/40 border-t-blue-600 animate-spin" />
              <div className="absolute w-6 h-6 rounded-md bg-black flex items-center justify-center">
                <Gamepad2 className="w-3 h-3 text-brand-blue" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-display font-semibold text-xs text-zinc-100 uppercase tracking-widest leading-none">
                ALLOCATING SERVER RE-ROUTE BUFFER
              </p>
              <p className="font-mono text-[9px] text-zinc-500 uppercase mt-1.5">
                Connecting to fast unblocked game host...
              </p>
            </div>
          </div>
        )}

        {/* The Game Iframe */}
        <iframe
          ref={iframeRef}
          src={activeMirror}
          title={game.title}
          className="w-full h-full border-none bg-black select-none"
          allow="autoplay; fullscreen; keyboard; gamepad"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* 3. Bottom Immersive Overlay Info Panel */}
      <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-2 max-w-sm">
        {/* Toggleable controls instructions HUD */}
        {showHUD && (
          <div className="p-3 bg-[#111111]/95 border border-slate-900 rounded-xl backdrop-blur-md text-left flex flex-col gap-1.5">
            <span className="font-mono text-[9px] text-brand-blue font-bold uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3 h-3" />
              Active Game Controls HUD
            </span>
            <p className="font-mono text-[10px] text-zinc-200 bg-black/60 p-2 rounded border border-slate-900/60">
              {game.controls}
            </p>
            <span className="font-sans text-[8px] text-zinc-500 select-none">
              Pro-Tip: If the game freezes, click inside the frame to capture keyboard hooks.
            </span>
          </div>
        )}

        {/* Overlay HUD Visibility Controller */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHUD(!showHUD)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111111]/95 border border-slate-900 text-[10px] font-mono text-zinc-400 hover:text-blue-400 rounded-lg backdrop-blur-md cursor-pointer"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{showHUD ? 'Hide HUD' : 'Show Controls'}</span>
          </button>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111111]/95 border border-slate-900 text-[10px] font-mono text-emerald-400 rounded-lg backdrop-blur-md">
            <MonitorCheck className="w-3 h-3 text-emerald-500" />
            <span>Sandboxed safe mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
