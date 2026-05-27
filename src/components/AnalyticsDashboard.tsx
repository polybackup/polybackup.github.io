import React, { useEffect, useState } from 'react';
import { 
  Eye, 
  Users, 
  Gamepad2, 
  PlusCircle, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  FileCheck, 
  Clock3, 
  AlertCircle, 
  Trash,
  ChevronRight,
  TrendingUp,
  Server,
  Lock,
  Key
} from 'lucide-react';
import { AnalyticsSummary, RequestedGame } from '../types';

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('polybackup_admin_authed') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) {
        throw new Error('Failed to retrieve server telemetry');
      }
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while communicating with the backend');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
      
      // Auto-refresh stats every 45 seconds secretly
      const interval = setInterval(() => {
        fetchAnalytics(true);
      }, 45000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    fetchAnalytics(true);
  };

  const handleStatusUpdate = async (id: string, nextStatus: 'pending' | 'reviewed' | 'added') => {
    try {
      const response = await fetch('/api/analytics/request/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (response.ok) {
        // Optimistically update or fresh-fetch
        fetchAnalytics(true);
      }
    } catch (err) {
      console.error('Failed to update request status', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Polybackup') {
      sessionStorage.setItem('polybackup_admin_authed', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Access Denied. Incorrect administrator credentials.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 bg-[#050505] overflow-hidden relative">
        {/* Background Mesh */}
        <div className="bg-mesh" />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        <div className="max-w-md w-full relative z-10 text-center space-y-6">
          <div className="mx-auto w-14 h-14 bg-red-950/20 border border-red-900/40 text-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)] animate-bounce">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-red-500 font-semibold tracking-widest uppercase block animate-pulse">
              Restricted Area
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
              ADMIN <span className="text-red-500">GATEWAY</span>
            </h2>
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              This panel is restricted exclusively to Polybackup Administrators. Please enter the authorization password to access backend analytics dashboards.
            </p>
          </div>

          <div className="bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 backdrop-blur-md text-left">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                  Administrator Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator passkey..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full bg-[#161618] border border-slate-800 text-zinc-100 text-xs px-3 py-2.5 rounded-lg outline-none focus:border-red-500/50 transition-colors font-mono"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-mono bg-rose-950/20 p-2.5 rounded border border-rose-900/30">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-red-600 hover:bg-red-500 transition-colors text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_4px_15px_rgba(239,68,68,0.15)] cursor-pointer"
              >
                <span>Authorize Credentials</span>
                <Key className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <p className="font-mono text-[9px] text-zinc-550 uppercase tracking-wide">
            // Secure connection established • SSL enforced
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 bg-[#050505]">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg border border-blue-900/40 border-t-blue-600 animate-spin" />
          <BarChart3Icon className="absolute w-4 h-4 text-blue-500" />
        </div>
        <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest animate-pulse">
          Fetching operational telemetry stats...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-[#050505]">
        <div className="max-w-md text-center space-y-4 bg-[#111111] p-8 rounded-xl border border-rose-950/40 shadow-[0_4px_30px_rgba(244,63,94,0.05)]">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
          <h3 className="font-display font-medium text-lg uppercase text-zinc-100">Telemetry Outage</h3>
          <p className="text-zinc-400 text-xs font-mono leading-relaxed">{error || "Could not link connection to backend analytics server."}</p>
          <button 
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/50 text-rose-400 font-mono text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
          >
            Re-establish Link
          </button>
        </div>
      </div>
    );
  }

  const { summary, screenBreakdown, popularGames, recentPlays, requests, timeSeries } = data;

  // Formatting minutes helper
  const formatPlaytime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-[#050505] overflow-hidden">
      {/* Visual background details */}
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        
        {/* Dashboard Title & Trigger panel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <span className="font-mono text-xs text-brand-blue font-semibold tracking-widest uppercase block mb-2">
              Polybackup Cloud Service
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 uppercase tracking-tight">
              ADMIN <span className="text-brand-blue">DASHBOARD</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 font-mono tracking-wide uppercase hidden sm:inline">
              // Live updates active (45s loop)
            </span>
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#111111]/90 border border-slate-800 text-xs font-mono font-medium text-zinc-300 hover:text-blue-400 hover:border-blue-500/40 rounded-lg active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Bento Board: Core Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-blue-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Page Views</span>
              <div className="p-1 px-1.5 rounded bg-blue-950/30 text-blue-400 border border-blue-900/30">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-zinc-100">{summary.totalPageviews}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Pages fetched</p>
            </div>
          </div>

          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-teal-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Unique Users</span>
              <div className="p-1 px-1.5 rounded bg-teal-950/30 text-teal-400 border border-teal-900/30">
                <Users className="w-3.5 h-3.5 text-teal-400" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-zinc-100">{summary.uniqueUsers || 0}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Persistent count</p>
            </div>
          </div>

          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-emerald-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Sessions</span>
              <div className="p-1 px-1.5 rounded bg-emerald-950/30 text-emerald-450 border border-emerald-900/30">
                <Server className="w-3.5 h-3.5 text-emerald-450" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-zinc-100">{summary.uniqueSessions}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Temporary sessions</p>
            </div>
          </div>

          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-amber-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Plays Session</span>
              <div className="p-1 px-1.5 rounded bg-amber-950/30 text-amber-400 border border-amber-900/30">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-450" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-zinc-100">{summary.totalPlaySessions}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Emulator loaded</p>
            </div>
          </div>

          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-purple-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Suggestions</span>
              <div className="p-1 px-1.5 rounded bg-purple-950/30 text-purple-400 border border-purple-900/30">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-zinc-100">{summary.totalRequests}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Recommends board</p>
            </div>
          </div>

          <div className="bg-[#111111]/90 p-5 rounded-xl border border-slate-900/80 backdrop-blur-sm flex flex-col justify-between space-y-2 select-none hover:border-pink-900/35 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider font-bold">Pending</span>
              <div className="p-1 px-1.5 rounded bg-pink-950/30 text-pink-500 border border-pink-900/30">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
              </div>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-black text-rose-500">{summary.pendingRequests}</h4>
              <p className="font-mono text-[9px] text-zinc-650 mt-1 uppercase">// Backlog reviews</p>
            </div>
          </div>
        </div>

        {/* Core Charts Section & Traffic Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time series Column Chart */}
          <div className="lg:col-span-2 bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <h3 className="font-display font-bold text-xs text-zinc-100 uppercase tracking-wider">
                  Daily Application Traffic (7-Day History)
                </h3>
              </div>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">// Pageviews per calendar day</span>
            </div>

            {/* Render responsive Histogram chart container */}
            <div className="flex-1 min-h-[220px] flex items-end justify-between gap-2.5 px-2 relative pt-6">
              {/* Backgrid reference lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-zinc-900/40">
                <div className="w-full border-t border-zinc-900/60" />
                <div className="w-full border-t border-zinc-900/60" />
                <div className="w-full border-t border-zinc-900/60" />
              </div>

              {timeSeries.map((item, index) => {
                // Find percentage of high view
                const maxVal = Math.max(...timeSeries.map(t => t.count), 1);
                const pct = (item.count / maxVal) * 100;
                // Parse date label beautifully inside custom browser localized
                const dayLabel = new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });

                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                    {/* Hover Count pop */}
                    <span className="absolute -top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-605 text-white bg-blue-600 text-[10px] font-mono px-1.5 py-0.5 rounded shadow-[0_2px_8px_rgba(59,130,246,0.3)] mb-1 pointer-events-none transform -translate-y-full whitespace-nowrap">
                      {item.count} views
                    </span>

                    {/* Chart column bar block */}
                    <div 
                      style={{ height: `${Math.max(pct, 4)}%` }}
                      className="w-full max-w-[42px] bg-gradient-to-t from-blue-950 to-blue-600 border border-blue-500/30 rounded-t-lg transition-all duration-500 group-hover:from-blue-900 group-hover:to-blue-400 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.4)] cursor-pointer"
                    />

                    {/* Day string name */}
                    <span className="font-mono text-[9px] text-zinc-500 mt-3 uppercase tracking-tighter truncate w-full text-center">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Screen Breakdown pie panel & Most Played Games */}
          <div className="bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 flex flex-col">
            <div className="border-b border-zinc-900 pb-4 mb-4 flex items-center justify-between">
              <h3 className="font-display font-bold text-xs text-zinc-100 uppercase tracking-wider">
                Top Game Engagement Catalog
              </h3>
              <span className="font-mono text-[9px] text-brand-blue uppercase font-black tracking-widest">// Heat Ranking</span>
            </div>

            {popularGames.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Gamepad2 className="w-8 h-8 text-zinc-800" />
                <p className="font-mono text-[9.5px] text-zinc-500 uppercase mt-2 leading-relaxed">
                  No active gameplay duration data has been compiled yet.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-4 pt-2">
                {popularGames.map((game, index) => {
                  const maxPlays = Math.max(...popularGames.map(g => g.count), 1);
                  const playPct = (game.count / maxPlays) * 100;
                  
                  return (
                    <div key={game.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-semibold text-zinc-300 truncate max-w-[140px] uppercase">
                          {index + 1}. {game.title}
                        </span>
                        <div className="flex gap-2 text-[10px] font-mono text-zinc-500">
                          <span className="text-zinc-400">{game.count} plays</span>
                          <span>•</span>
                          <span className="text-yellow-500">{formatPlaytime(game.totalSeconds)}</span>
                        </div>
                      </div>

                      {/* Cool retro visual track bar */}
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${playPct}%` }}
                          className="h-full bg-gradient-to-r from-blue-700 to-blue-400 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Telemetry bottom raw sheets: Interactive Requests Manager & Live Play Activity audit logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* USER CUSTOM SUGGESTION PIPELINE */}
          <div className="bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 flex flex-col">
            <div className="border-b border-zinc-900 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <h3 className="font-display font-bold text-xs text-zinc-100 uppercase tracking-wider">
                  Suggestions Review Board
                </h3>
              </div>
              <span className="font-mono text-[9px] text-purple-400 font-bold uppercase tracking-widest">
                Direct Submission
              </span>
            </div>

            {requests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2.5">
                <FileCheck className="w-8 h-8 text-zinc-800" />
                <p className="font-mono text-[10px] text-zinc-500 uppercase">No customer game proposals cataloged.</p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                {requests.map((req) => (
                  <div key={req.id} className="p-3 bg-[#151518]/90 border border-slate-900/80 rounded-lg hover:border-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-left flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-sans font-bold text-xs text-zinc-200 capitalize tracking-wide">{req.title}</h4>
                        {/* Status chip */}
                        {req.status === 'added' ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-[8px] font-mono font-bold text-emerald-400 border border-emerald-900/30 uppercase tracking-widest flex items-center gap-0.5">
                            <CheckCircle className="w-2.5 h-2.5" /> Added
                          </span>
                        ) : req.status === 'reviewed' ? (
                          <span className="px-1.5 py-0.5 rounded bg-blue-950/40 text-[8px] font-mono font-bold text-blue-400 border border-blue-900/30 uppercase tracking-widest flex items-center gap-0.5">
                            <Clock3 className="w-2.5 h-2.5" /> Reviewed
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-yellow-950/40 text-[8px] font-mono font-bold text-yellow-400 border border-yellow-900/30 uppercase tracking-widest flex items-center gap-0.5 animate-pulse">
                            <Clock3 className="w-2.5 h-2.5" /> Pending
                          </span>
                        )}
                      </div>
                      {req.details && (
                        <p className="text-[11px] text-zinc-400 leading-normal bg-black/30 p-1.5 rounded border border-slate-950">
                          {req.details}
                        </p>
                      )}
                      <span className="block font-mono text-[8px] text-zinc-650 text-zinc-500 uppercase tracking-wider">
                        // Requested {new Date(req.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Operational action togglers */}
                    <div className="flex items-center gap-1.5 sm:self-center">
                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'reviewed')}
                          className="px-2 py-1 bg-blue-950/20 hover:bg-blue-955 hover:bg-blue-950/50 border border-blue-900/40 text-blue-400 text-[9px] font-mono uppercase rounded cursor-pointer transition-colors"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      
                      {req.status !== 'added' && (
                        <button
                          onClick={() => handleStatusUpdate(req.id, 'added')}
                          className="px-2 py-1 bg-emerald-950/25 hover:bg-emerald-950/50 border border-emerald-900/40 text-emerald-400 text-[9px] font-mono uppercase rounded cursor-pointer transition-colors"
                        >
                          Mark Added
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TELEMETRY EVENT STREAM */}
          <div className="bg-[#111111]/90 p-6 rounded-xl border border-slate-900/80 flex flex-col">
            <div className="border-b border-zinc-900 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="font-display font-bold text-xs text-zinc-100 uppercase tracking-wider">
                  Real-time Operational Play Event Stream
                </h3>
              </div>
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">// Log entries</span>
            </div>

            {recentPlays.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2.5">
                <Gamepad2 className="w-8 h-8 text-zinc-800" />
                <p className="font-mono text-[10px] text-zinc-500 uppercase">No active play event trace recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {recentPlays.map((play, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-[#151518]/90 border border-slate-900/80 rounded-lg text-left text-xs font-mono select-none flex items-start gap-3 hover:border-slate-800 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 animate-ping flex-shrink-0" />
                    
                    <div className="space-y-1 w-full">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-zinc-200 uppercase font-bold tracking-tight">
                          Loaded Game Frame
                        </span>
                        <span className="text-[9px] text-zinc-500">
                          {new Date(play.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-zinc-400 text-[11px] leading-relaxed">
                        Gameplay for <span className="text-blue-400 font-semibold">{play.gameTitle}</span> (ID: <span className="text-zinc-300">{play.gameId}</span>).
                        Session ID: <span className="text-zinc-500 text-[10px]">{play.sessionId.slice(0, 8)}...</span>
                      </div>

                      {play.durationSeconds > 0 && (
                        <div className="flex items-center gap-1.5 text-[9.5px] text-yellow-400 font-semibold uppercase mt-1">
                          <Clock className="w-3 h-3 text-yellow-405" />
                          <span>Duration watched: {formatPlaytime(play.durationSeconds)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Simple fallback icon in case it's declared separately
function BarChart3Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
