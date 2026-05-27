import { useState, useTransition } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import GamesPage from './components/GamesPage';
import GamePlayer from './components/GamePlayer';
import RequestForm from './components/RequestForm';
import { ActiveScreen, Game } from './types';

// Import our games list stored in JSON
import gamesData from './games.json';

export default function App() {
  const [activeScreen, setScreen] = useState<ActiveScreen>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Cast games list correctly
  const games: Game[] = gamesData as Game[];

  // Select game launcher
  const handleSelectGame = (gameId: string) => {
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

        {activeScreen === 'player' && activeGame ? (
          <GamePlayer 
            game={activeGame} 
            onBack={() => handleSetScreen('games')} 
          />
        ) : activeScreen === 'player' ? (
          <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
            <p className="font-mono text-xs text-rose-500 uppercase">Error: Game reference lost</p>
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
