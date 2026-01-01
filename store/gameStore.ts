import { Game, GameStore, Score } from "@/types";
import { checkGameFinished } from "@/utils/calculations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "@flip7_games";

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],

  loadGames: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const games = JSON.parse(data);
        set({ games });
      }
    } catch (error) {
      console.error("Error loading games:", error);
    }
  },

  addGame: (gameData) => {
    const newGame: Game = {
      ...gameData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const games = [...get().games, newGame];
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  updateGame: (id, gameData) => {
    const games = get().games.map((game) =>
      game.id === id ? { ...game, ...gameData, updatedAt: Date.now() } : game
    );
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  deleteGame: (id) => {
    const games = get().games.filter((game) => game.id !== id);
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  addScore: (gameId, round, playerId, value) => {
    const games = get().games.map((game) => {
      if (game.id === gameId) {
        const newScore: Score = {
          id: `${Date.now()}-${Math.random()}`,
          round,
          playerId,
          value,
          timestamp: Date.now(),
        };
        const updatedGame = {
          ...game,
          scores: [...game.scores, newScore],
          updatedAt: Date.now(),
        };

        // Vérifier si la partie est terminée
        if (!updatedGame.finishedAt) {
          const { finished, winnerId } = checkGameFinished(updatedGame);
          if (finished) {
            updatedGame.finishedAt = Date.now();
            updatedGame.winnerId = winnerId;
          }
        }

        return updatedGame;
      }
      return game;
    });
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  updateScore: (gameId, scoreId, value) => {
    const games = get().games.map((game) => {
      if (game.id === gameId) {
        const updatedGame = {
          ...game,
          scores: game.scores.map((score) =>
            score.id === scoreId
              ? { ...score, value, timestamp: Date.now() }
              : score
          ),
          updatedAt: Date.now(),
        };

        // Vérifier si la partie est terminée après la mise à jour
        if (!updatedGame.finishedAt) {
          const { finished, winnerId } = checkGameFinished(updatedGame);
          if (finished) {
            updatedGame.finishedAt = Date.now();
            updatedGame.winnerId = winnerId;
          }
        }

        return updatedGame;
      }
      return game;
    });
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },

  deleteScore: (gameId, scoreId) => {
    const games = get().games.map((game) => {
      if (game.id === gameId) {
        return {
          ...game,
          scores: game.scores.filter((score) => score.id !== scoreId),
          updatedAt: Date.now(),
        };
      }
      return game;
    });
    set({ games });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  },
}));
