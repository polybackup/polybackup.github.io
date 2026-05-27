export interface Mirror {
  name: string;
  url: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  iframeUrl: string;
  mirrors: Mirror[];
  category: string;
  controls: string;
  isPlaceholder: boolean;
}

export type ActiveScreen = 'home' | 'games' | 'player' | 'request' | 'analytics';

export interface PerformanceEvent {
  timestamp: string;
  gameId: string;
  gameTitle: string;
  sessionId: string;
  durationSeconds: number;
  mirrorUrl?: string;
}

export interface RequestedGame {
  id: string;
  timestamp: string;
  title: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'added';
}

export interface AnalyticsSummary {
  summary: {
    totalPageviews: number;
    uniqueSessions: number;
    uniqueUsers: number;
    totalPlaySessions: number;
    totalRequests: number;
    pendingRequests: number;
  };
  screenBreakdown: Record<string, number>;
  popularGames: Array<{
    id: string;
    title: string;
    count: number;
    totalSeconds: number;
  }>;
  recentPlays: PerformanceEvent[];
  requests: RequestedGame[];
  timeSeries: Array<{ date: string; count: number }>;
}

