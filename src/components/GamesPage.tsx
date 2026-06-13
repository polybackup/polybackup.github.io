import { Game } from '../types';
import { Play, Calendar, Lock, ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';

interface GamesPageProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onRequestClick: () => void;
}

export default function GamesPage({ games, onSelectGame, onRequestClick }: GamesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'racing' | 'arcade' | 'coming-soon'>('all');

  // Filter logic
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'all') return true;
    if (filter === 'racing') return game.category.toLowerCase().includes('racing') && !game.isPlaceholder;
    if (filter === 'arcade') return game.category.toLowerCase().includes('arcade') && !game.isPlaceholder;
    if (filter === 'coming-soon') return game.isPlaceholder;
    return true;
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-6 bg-[#050505] overflow-hidden">
      {/* Background Mesh */}
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <span className="font-mono text-xs text-brand-blue font-semibold tracking-widest uppercase block mb-2">
              POLYBACKUP SYSTEMS CORE
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
              GAME <span className="text-brand-blue">LIBRARY</span>
            </h2>
          </div>
          <p className="max-w-xs text-xs text-slate-500 font-mono tracking-wide leading-relaxed uppercase">
            // Showing {games.filter(g => !g.isPlaceholder).length} of {games.length} Active Titles
          </p>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111111]/90 p-4 rounded-xl border border-slate-900/80 backdrop-blur-sm">
          {/* Quick search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter game titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#161618] border border-slate-800 focus:border-blue-500/50 text-zinc-200 text-xs pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all duration-300 font-mono"
            />
          </div>

          {/* Tab filter pill-buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                filter === 'all'
                  ? 'bg-blue-950/30 text-brand-blue border border-blue-900/40 text-glow'
                  : 'text-zinc-400 hover:text-blue-500 border border-transparent'
              }`}
            >
              All Slots ({games.length})
            </button>
            <button
              onClick={() => setFilter('racing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                filter === 'racing'
                  ? 'bg-blue-950/30 text-brand-blue border border-blue-900/40 text-glow'
                  : 'text-zinc-400 hover:text-blue-500 border border-transparent'
              }`}
            >
              Racing
            </button>
            <button
              onClick={() => setFilter('coming-soon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                filter === 'coming-soon'
                  ? 'bg-blue-950/30 text-brand-blue border border-blue-900/40 text-glow'
                  : 'text-zinc-400 hover:text-blue-500 border border-transparent'
              }`}
            >
              Coming Soon
            </button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center sm:justify-items-stretch">
          {filteredGames.map((game) => {
            if (game.isPlaceholder) {
              return (
                /* Sleek placeholder / Blank Slot layout */
                <div
                  key={game.id}
                  className="group relative flex flex-col w-full h-full rounded-xl bg-[#111111]/30 border border-slate-900 border-dashed p-5 text-left transition-all duration-300 hover:border-blue-500/20"
                >
                  <div className="aspect-[4/3] w-full rounded-lg bg-[#161618] border border-slate-900/40 flex flex-col items-center justify-center p-6 mb-4 relative overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-grid opacity-20" />
                    <Lock className="w-8 h-8 text-zinc-800 group-hover:text-blue-500/30 group-hover:scale-105 transition-all duration-300 z-10" />
                    <span className="mt-4 font-mono text-[10px] text-zinc-700 tracking-wider uppercase z-10">
                      [ EMPTY SLOT ]
                    </span>
                  </div>

                  <div className="space-y-4 relative flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-blue-500/40 uppercase font-bold">
                          {game.category}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] text-zinc-600 uppercase">
                          <Calendar className="w-2.5 h-2.5" />
                          UNALLOCATED
                        </span>
                      </div>
                      
                      <h3 className="font-display font-bold text-base text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-sans line-clamp-2">
                        {game.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-900/40 flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] text-zinc-600">
                        EMPTY HARBOR
                      </span>
                      <button 
                        onClick={onRequestClick}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-950/20 hover:bg-blue-600 border border-blue-900/30 hover:border-blue-500 text-brand-blue hover:text-white font-mono text-[9px] uppercase tracking-wider font-bold transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(30,58,138,0.05)] hover:shadow-[0_2px_10px_rgba(59,130,246,0.25)]"
                      >
                        Request Game &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Sleek Active Playable Games Cards (e.g. PolyTrack)
            return (
              <div
                key={game.id}
                className="group relative flex flex-col w-full h-full rounded-xl bg-[#111111] border border-slate-900 p-4 hover:border-blue-500 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
              >
                {/* Image launcher */}
                <button
                  onClick={() => onSelectGame(game.id)}
                  className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-slate-900 group-hover:border-blue-500/20 mb-4 bg-zinc-950 relative block group cursor-pointer"
                  style={{ contentVisibility: 'auto' }}
                >
                  <div className="absolute inset-0 bg-blue-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  
                  <img
                    src={game.imageUrl}
                    alt={`${game.title} Cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 scale-100"
                    referrerPolicy="no-referrer"
                  />

                  {/* Play Action Overlay matching Sleek design */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="w-12 h-12 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white transition-all transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#050505]/80 border border-slate-800 text-brand-blue font-mono text-[9px] uppercase tracking-wider z-20">
                    ACTIVE
                  </div>
                </button>

                {/* Information */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-brand-blue font-semibold uppercase tracking-wide">
                        {game.category}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest text-glow flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        ONLINE
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectGame(game.id)}
                      className="font-display font-extrabold text-lg text-zinc-100 group-hover:text-brand-blue transition-colors uppercase flex items-center gap-1 text-left cursor-pointer"
                    >
                      {game.title}
                      <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1">
                      {game.description}
                    </p>
                  </div>

                  {/* Controls Layout footer panel */}
                  <div className="pt-3 border-t border-slate-900 mt-2">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase block mb-1">
                      Controls/Keys layout
                    </span>
                    <span className="font-mono text-[10px] text-zinc-300 block bg-[#161618] p-1.5 rounded border border-slate-900/60 leading-tight">
                      {game.controls}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
