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

export type ActiveScreen = 'home' | 'games' | 'player' | 'request';
