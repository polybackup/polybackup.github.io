import { useState, useTransition, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import GamesPage from './components/GamesPage';
import GamePlayer from './components/GamePlayer';
import RequestForm from './components/RequestForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PhysicsPortal from './components/PhysicsPortal';
import { ActiveScreen, Game } from './types';

// Import our games list stored in JSON
import gamesData from './games.json';

// Global non-blocking analytics dispatcher helper
export const trackTelemetryEvent = async (type: string, data: any) => {
  try {
    let sessionId = sessionStorage.getItem('polybackup_session_id');
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('polybackup_session_id', sessionId);
    }

    let userId = localStorage.getItem('polybackup_user_id');
    if (!userId) {
      userId = `usr_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('polybackup_user_id', userId);
    }
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, sessionId, userId })
    });
  } catch (error) {
    // Fail silently in case of network outages or offline tests
    console.debug('Telemetry logging bypassed.', error);
  }
};

export default function App() {
  const [activeScreen, setScreen] = useState<ActiveScreen>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  // Gatekeeper for Polybackup
  const [isPolybackupUnlocked, setIsPolybackupUnlocked] = useState(() => {
    return sessionStorage.getItem('polybackup_unlocked') === 'true';
  });

  const [isTeacherAuthed, setIsTeacherAuthed] = useState(() => {
    return sessionStorage.getItem('physics4students_teacher_authed') === 'true';
  });
  const [, startTransition] = useTransition();

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('polybackup_custom_games');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached games list', e);
      }
    }
    return gamesData as Game[];
  });

  // Bootstrap session and log initial pageview
  useEffect(() => {
    let sessionId = sessionStorage.getItem('polybackup_session_id');
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('polybackup_session_id', sessionId);
    }
    trackTelemetryEvent('pageview', { screen: 'init_app' });
  }, []);

  // Track screen transitions dynamically
  useEffect(() => {
    if (isPolybackupUnlocked) {
      trackTelemetryEvent('pageview', { screen: activeScreen });
    }
  }, [activeScreen, isPolybackupUnlocked]);

  // Select game launcher with telemetry dispatch
  const handleSelectGame = (gameId: string) => {
    const selectedGame = games.find(g => g.id === gameId);
    if (selectedGame) {
      trackTelemetryEvent('gameplay_start', { 
        gameId, 
        gameTitle: selectedGame.title,
        mirrorUrl: selectedGame.iframeUrl 
      });
    }

    startTransition(() => {
      setSelectedGameId(gameId);
      setScreen('player');
    });
  };

  // Safe navigation wrapper
  const handleSetScreen = (screen: ActiveScreen) => {
    startTransition(() => {
      setScreen(screen);
      if (screen !== 'player') {
        setSelectedGameId(null);
      }
    });
  };

  // Find active playing game
  const activeGame = games.find(g => g.id === selectedGameId);

  // If the portal is NOT unlocked, we only show the harmless, beautiful scholastic encyclopedia
  if (!isPolybackupUnlocked) {
    return (
      <PhysicsPortal 
        onUnlockPolybackup={() => {
          setIsPolybackupUnlocked(true);
          sessionStorage.setItem('polybackup_unlocked', 'true');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans antialiased overflow-x-hidden">
      {/* 
        Header is only hidden when actively playing a game inside our immersive frame, 
        giving games true 100% fullscreen height/width real estate, or visible otherwise.
      */}
      {activeScreen !== 'player' && (
        <Header 
          activeScreen={activeScreen} 
          setScreen={handleSetScreen} 
          setSelectedGameId={setSelectedGameId}
          isTeacherAuthed={isTeacherAuthed}
          setIsTeacherAuthed={setIsTeacherAuthed}
          onLockPortal={() => {
            setIsPolybackupUnlocked(false);
            sessionStorage.removeItem('polybackup_unlocked');
            setIsTeacherAuthed(false);
            sessionStorage.removeItem('physics4students_teacher_authed');
            handleSetScreen('home');
          }}
        />
      )}

      {/* Main viewport switcher */}
      <main className="w-full">
        {activeScreen === 'home' && (
          <Home setScreen={handleSetScreen} />
        )}

        {activeScreen === 'games' && (
          <GamesPage 
            games={games} 
            onSelectGame={handleSelectGame} 
            onRequestClick={() => handleSetScreen('request')}
          />
        )}

        {activeScreen === 'request' && (
          <RequestForm />
        )}

        {activeScreen === 'analytics' && (
          <AnalyticsDashboard 
            games={games}
            onUpdateGames={(updatedGames) => {
              setGames(updatedGames);
              localStorage.setItem('polybackup_custom_games', JSON.stringify(updatedGames));
            }}
          />
        )}

        {activeScreen === 'player' && activeGame ? (
          <GamePlayer 
            game={activeGame} 
            onBack={() => handleSetScreen('games')} 
          />
        ) : activeScreen === 'player' ? (
          <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <p className="font-mono text-xs text-rose-550 uppercase">Error: Game reference lost</p>
            <button 
              onClick={() => handleSetScreen('games')}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 rounded cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
