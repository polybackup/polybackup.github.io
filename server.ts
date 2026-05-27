import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up server-side analytics file store
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'analytics.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface Pageview {
  timestamp: string;
  screen: string;
  sessionId: string;
  userId?: string;
  userAgent: string;
}

interface Gameplay {
  timestamp: string;
  gameId: string;
  gameTitle: string;
  sessionId: string;
  durationSeconds: number; // For tracking how long they play
  mirrorUrl?: string;
}

interface GameRequest {
  id: string;
  timestamp: string;
  title: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'added';
}

interface AnalyticsStore {
  pageviews: Pageview[];
  gameplays: Gameplay[];
  requests: GameRequest[];
}

const getInitialStore = (): AnalyticsStore => ({
  pageviews: [],
  gameplays: [],
  requests: [
    // Prepopulate with a few sample requests if file does not exist, for dashboard polish
    {
      id: 'req-1',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      title: 'Run 3',
      details: 'Please add the HTML5 version of Run 3.',
      status: 'added'
    },
    {
      id: 'req-2',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      title: 'Retro Bowl',
      details: 'Amazing football simulator unblocked.',
      status: 'pending'
    }
  ]
});

function readData(): AnalyticsStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        pageviews: parsed.pageviews || [],
        gameplays: parsed.gameplays || [],
        requests: parsed.requests || []
      };
    }
  } catch (error) {
    console.error('Error reading file store. Resetting state.', error);
  }
  
  const initial = getInitialStore();
  writeData(initial);
  return initial;
}

function writeData(data: AnalyticsStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to analytics store.', error);
  }
}

// REST APIs for analytics events & dashboard
app.post('/api/analytics/track', (req, res) => {
  const { type, data, sessionId, userId } = req.body;
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';
  const geoIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  
  const timestamp = new Date().toISOString();
  const store = readData();

  if (type === 'pageview') {
    store.pageviews.push({
      timestamp,
      screen: data.screen || 'unknown',
      sessionId,
      userId,
      userAgent: String(userAgent)
    });
  } else if (type === 'gameplay_start') {
    store.gameplays.push({
      timestamp,
      gameId: data.gameId || 'unknown',
      gameTitle: data.gameTitle || 'unknown',
      sessionId,
      durationSeconds: data.durationSeconds || 0,
      mirrorUrl: data.mirrorUrl
    });
  } else if (type === 'gameplay_duration') {
    // Attempt to locate recent gameplay of index matching sessionId and gameId and update duration
    const latestPlay = store.gameplays
      .filter(g => g.sessionId === sessionId && g.gameId === data.gameId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (latestPlay) {
      latestPlay.durationSeconds = (latestPlay.durationSeconds || 0) + (data.addedSeconds || 10);
    } else {
      // Backup creation
      store.gameplays.push({
        timestamp,
        gameId: data.gameId || 'unknown',
        gameTitle: data.gameTitle || 'unknown',
        sessionId,
        durationSeconds: data.addedSeconds || 10,
        mirrorUrl: data.mirrorUrl
      });
    }
  }

  writeData(store);
  res.json({ success: true });
});

// Post a brand new requests directly
app.post('/api/analytics/request', (req, res) => {
  const { title, details } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title field is required' });
  }

  const store = readData();
  const newRequest: GameRequest = {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    title,
    details: details || '',
    status: 'pending'
  };

  store.requests.unshift(newRequest);
  writeData(store);
  res.json({ success: true, request: newRequest });
});

// Update the status of custom request
app.post('/api/analytics/request/status', (req, res) => {
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'ID and status values are required' });
  }

  const store = readData();
  const index = store.requests.findIndex(r => r.id === id);
  if (index !== -1) {
    store.requests[index].status = status;
    writeData(store);
    return res.json({ success: true, request: store.requests[index] });
  }

  res.status(404).json({ error: 'Request label reference not found.' });
});

// Fetch detailed dashboard statistics
app.get('/api/analytics/dashboard', (req, res) => {
  const store = readData();
  
  // Calculate aggregate metrics
  const totalPageviews = store.pageviews.length;
  
  const uniqueSessions = new Set(store.pageviews.map(p => p.sessionId)).size;
  const uniqueUsers = new Set(store.pageviews.map(p => p.userId || p.sessionId)).size;
  
  // High-level screen breakdowns
  const screenBreakdown: Record<string, number> = {};
  store.pageviews.forEach(p => {
    screenBreakdown[p.screen] = (screenBreakdown[p.screen] || 0) + 1;
  });

  // Calculate high-level game stats
  const totalPlaySessions = store.gameplays.length;
  const gameStats: Record<string, { id: string; title: string; count: number; totalSeconds: number }> = {};
  
  store.gameplays.forEach(p => {
    if (!gameStats[p.gameId]) {
      gameStats[p.gameId] = {
        id: p.gameId,
        title: p.gameTitle,
        count: 0,
        totalSeconds: 0
      };
    }
    gameStats[p.gameId].count += 1;
    gameStats[p.gameId].totalSeconds += p.durationSeconds || 0;
  });

  const popularGamesList = Object.values(gameStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Time Series: Last 7 Days Pageviews
  const last7DaysBreakdown: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const daySlash = d.toISOString().split('T')[0];
    last7DaysBreakdown[daySlash] = 0;
  }

  store.pageviews.forEach(p => {
    const dateStr = p.timestamp.split('T')[0];
    if (Object.prototype.hasOwnProperty.call(last7DaysBreakdown, dateStr)) {
      last7DaysBreakdown[dateStr]++;
    }
  });

  res.json({
    summary: {
      totalPageviews,
      uniqueSessions,
      uniqueUsers,
      totalPlaySessions,
      totalRequests: store.requests.length,
      pendingRequests: store.requests.filter(r => r.status === 'pending').length
    },
    screenBreakdown,
    popularGames: popularGamesList,
    recentPlays: store.gameplays.slice(-10).reverse(), // Latest 10 play actions
    requests: store.requests,
    timeSeries: Object.entries(last7DaysBreakdown).map(([date, count]) => ({ date, count }))
  });
});

async function startServer() {
  // Vite integration as middleware in development Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);
    console.log('[Express - DEV] Vite Dev injection server running.');
  } else {
    // Direct static build delivery in Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Express - PROD] Client assets served from dist/.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening strictly on PORT:${PORT}`);
  });
}

startServer();
