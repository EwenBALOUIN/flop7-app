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

const WINNING_SCORE = 200;

export const checkGameFinished = (game: Game): { finished: boolean; winnerId?: string } => {
  if (game.finishedAt) {
    return { finished: true, winnerId: game.winnerId };
  }

  const sortedPlayers = getPlayersSortedByScore(game);
  if (sortedPlayers.length === 0) {
    return { finished: false };
  }

  const topPlayer = sortedPlayers[0];
  const topScore = getPlayerTotal(game, topPlayer.id);

  if (topScore >= WINNING_SCORE) {
    return { finished: true, winnerId: topPlayer.id };
  }

  return { finished: false };
};

export const getGameStats = (game: Game) => {
  const sortedPlayers = getPlayersSortedByScore(game);
  const maxRound = getMaxRound(game);
  const rounds = Array.from({ length: maxRound }, (_, i) => i + 1);

  return {
    sortedPlayers: sortedPlayers.map((player) => ({
      player,
      total: getPlayerTotal(game, player.id),
      rounds: rounds.map((round) => {
        const score = game.scores.find(
          (s) => s.round === round && s.playerId === player.id
        );
        return score?.value ?? 0;
      }),
    })),
    maxRound,
    winner: sortedPlayers[0],
    winnerScore: sortedPlayers.length > 0 ? getPlayerTotal(game, sortedPlayers[0].id) : 0,
  };
};

