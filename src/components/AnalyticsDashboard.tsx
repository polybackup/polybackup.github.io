import React, { useState } from 'react';
import { Game } from '../types';
import { 
  Lock, 
  Key, 
  AlertCircle, 
  Save, 
  RotateCcw, 
  Gamepad2, 
  Edit2, 
  CheckCircle,
  Link,
  Info
} from 'lucide-react';

interface AnalyticsDashboardProps {
  games: Game[];
  onUpdateGames: (newGames: Game[]) => void;
}

export default function AnalyticsDashboard({ games, onUpdateGames }: AnalyticsDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('polybackup_admin_authed') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Editing mode states
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form input states
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIframeUrl, setEditIframeUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editControls, setEditControls] = useState('');
  const [editIsPlaceholder, setEditIsPlaceholder] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().toLowerCase() === 'polybackup') {
      sessionStorage.setItem('polybackup_admin_authed', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Access Denied. Incorrect passcode.');
    }
  };

  const handleStartEdit = (game: Game) => {
    setEditingGame(game);
    setEditTitle(game.title);
    setEditCategory(game.category);
    setEditDescription(game.description);
    setEditIframeUrl(game.iframeUrl);
    setEditImageUrl(game.imageUrl);
    setEditControls(game.controls);
    setEditIsPlaceholder(game.isPlaceholder);
    setSuccessMessage(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    const updatedGames = games.map(g => {
      if (g.id === editingGame.id) {
        return {
          ...g,
          title: editTitle.trim(),
          category: editCategory.trim(),
          description: editDescription.trim(),
          iframeUrl: editIframeUrl.trim(),
          imageUrl: editImageUrl.trim(),
          controls: editControls.trim(),
          isPlaceholder: editIsPlaceholder
        };
      }
      return g;
    });

    onUpdateGames(updatedGames);
    setEditingGame(null);
    setSuccessMessage(`Successfully updated "${editTitle}" slot details!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all slots to their default games list? This will erase any custom pasted URLs.')) {
      localStorage.removeItem('polybackup_custom_games');
      // Reload page to re-initialize original JSON
      window.location.reload();
    }
  };

  // Center-aligned Authentication Gateway Wall
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 bg-[#050505] relative overflow-hidden">
        {/* Ambient grid bg */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        
        <div className="max-w-md w-full relative z-10 text-center space-y-6">
          <div className="mx-auto w-12 h-12 bg-blue-950/20 border border-blue-900/35 text-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs text-blue-500 font-semibold tracking-wider block uppercase">
              System Administrator Gateway
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 uppercase tracking-tight">
              ADMIN LOGIN
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Unlock core slot configurations by verifying the administrative passcode.
            </p>
          </div>

          <div className="bg-[#111111]/95 p-6 rounded-xl border border-slate-900 text-left space-y-4 shadow-xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5 font-mono">
                <label className="block text-[9.5px] text-zinc-400 uppercase tracking-wider font-bold">
                  Enter Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Password..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full bg-[#161618] border border-slate-800 text-zinc-100 text-xs px-3.5 py-2.5 rounded outline-none focus:border-blue-500/50 transition-colors font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-mono bg-rose-950/20 p-2 rounded border border-rose-900/30">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-mono font-bold text-xs uppercase tracking-wider rounded cursor-pointer shadow-md"
              >
                <span>Authorize Credentials</span>
                <Key className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Banner Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="font-mono text-xs text-brand-blue font-semibold tracking-widest uppercase block mb-1">
              SYSTEM PORT PORTAL
            </span>
            <h2 className="font-display font-black text-3xl text-zinc-100 uppercase tracking-tight">
              GAME SLOT <span className="text-brand-blue">MANAGER</span>
            </h2>
          </div>

          <button
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#1a1a1c] border border-slate-800 hover:border-slate-700 text-xs font-mono text-zinc-400 hover:text-zinc-200 rounded transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Settings</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-mono bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 animate-fadeIn">
            <CheckCircle className="w-4 h-4 flex-shrink-0 animate-pulse" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Slot Grid System */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {games.map((slot) => {
            const isEmpty = slot.isPlaceholder || !slot.iframeUrl;
            return (
              <div 
                key={slot.id}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 hover:border-blue-500/35 transition-all ${
                  isEmpty 
                    ? 'bg-[#0f0f11]/50 border-slate-900/60 opacity-70' 
                    : 'bg-[#111111] border-slate-900'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-450 border border-slate-950">
                      ID: {slot.id}
                    </span>
                    <span className={`text-[8.5px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      isEmpty 
                        ? 'bg-zinc-950 text-zinc-500' 
                        : 'bg-blue-950 text-blue-400 border border-blue-900/20'
                    }`}>
                      {isEmpty ? 'Placeholder' : 'Active Slot'}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-md text-zinc-150 uppercase truncate">
                    {slot.title}
                  </h3>

                  <div className="bg-[#0a0a0c] p-2 rounded border border-slate-950 font-mono text-[10px] space-y-1.5 text-zinc-500 select-none">
                    <div className="flex items-center gap-1.5">
                      <Link className="w-3 h-3 text-blue-500/50 flex-shrink-0" />
                      <span className="text-zinc-400 truncate">
                        {isEmpty ? 'Unallocated link path' : slot.iframeUrl}
                      </span>
                    </div>
                    <div className="text-[9.5px]">
                      Category: <span className="text-zinc-350">{slot.category}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-950 flex justify-end">
                  <button
                    onClick={() => handleStartEdit(slot)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-950/30 hover:bg-blue-900/25 border border-blue-900/20 hover:border-blue-500/40 text-blue-400 text-xs font-mono uppercase rounded transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Configure Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Edit overlay */}
        {editingGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
            <div 
              className="relative max-w-lg w-full bg-[#0d0d0f] border border-slate-900 rounded-xl overflow-hidden shadow-2xl p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                  Edit Slot Target: {editingGame.id}
                </span>
                <h3 className="font-display font-black text-xl text-zinc-100 uppercase tracking-tight">
                  SLOT ASSIGNMENT
                </h3>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                      Game Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                      Category Genre
                    </label>
                    <input
                      type="text"
                      required
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                    IFrame Link / Play URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={editIframeUrl}
                    onChange={(e) => setEditIframeUrl(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40 font-mono"
                  />
                  <p className="text-[9px] text-zinc-500 font-mono">
                    // Paste the direct sandbox URL or repository index link.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                    Thumbnail Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                    Keyboard Controls Layout
                  </label>
                  <input
                    type="text"
                    value={editControls}
                    onChange={(e) => setEditControls(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-mono text-[9px] text-zinc-450 uppercase font-bold tracking-wider">
                    Game Description
                  </label>
                  <textarea
                    rows={2.5}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-[#141416] border border-slate-800 text-zinc-100 text-xs px-3 py-2 rounded outline-none focus:border-blue-500/40 resize-none"
                  />
                </div>

                {/* State switch */}
                <div className="flex items-center gap-3 py-2 hover:bg-slate-900/20 px-1 rounded transition-colors select-none">
                  <input
                    type="checkbox"
                    id="slot_active_checkbox"
                    checked={!editIsPlaceholder}
                    onChange={(e) => setEditIsPlaceholder(!e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-[#141416] border-slate-800 rounded outline-none"
                  />
                  <label htmlFor="slot_active_checkbox" className="font-mono text-[10.5px] text-zinc-350 cursor-pointer">
                    Enable slot and publish on Games Catalog immediately
                  </label>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-950 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setEditingGame(null)}
                    className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-center rounded uppercase cursor-pointer transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-center rounded uppercase cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Assignment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
