import { Game, Player, Score } from '@/types';

export const getPlayerTotal = (game: Game, playerId: string): number => {
  return game.scores
    .filter((score) => score.playerId === playerId)
    .reduce((total, score) => total + score.value, 0);
};

export const getRoundScores = (game: Game, round: number): Record<string, number> => {
  const roundScores: Record<string, number> = {};
  game.scores
    .filter((score) => score.round === round)
    .forEach((score) => {
      roundScores[score.playerId] = score.value;
    });
  return roundScores;
};

export const getMaxRound = (game: Game): number => {
  if (game.scores.length === 0) return 0;
  return Math.max(...game.scores.map((score) => score.round));
};

export const getPlayersSortedByScore = (game: Game): Player[] => {
  return [...game.players].sort((a, b) => {
    const totalA = getPlayerTotal(game, a.id);
    const totalB = getPlayerTotal(game, b.id);
    return totalB - totalA;
  });
};

export const formatScore = (score: number): string => {
  return score.toString();
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

