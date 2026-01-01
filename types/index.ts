export interface Player {
  id: string;
  name: string;
}

export interface Score {
  id: string;
  round: number;
  playerId: string;
  value: number;
  timestamp: number;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  scores: Score[];
  createdAt: number;
  updatedAt: number;
}

export interface GameStore {
  games: Game[];
  addGame: (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  loadGames: () => Promise<void>;
  addScore: (gameId: string, round: number, playerId: string, value: number) => void;
  updateScore: (gameId: string, scoreId: string, value: number) => void;
  deleteScore: (gameId: string, scoreId: string) => void;
}

