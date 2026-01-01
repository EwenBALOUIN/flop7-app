import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/useTheme';
import { Game } from '@/types';
import { formatDate, getPlayerTotal, getPlayersSortedByScore } from '@/utils/calculations';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  onDelete: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPress, onDelete }) => {
  const theme = useTheme();
  const sortedPlayers = getPlayersSortedByScore(game);
  const winner = sortedPlayers[0];
  const winnerTotal = winner ? getPlayerTotal(game, winner.id) : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text variant="h3" style={styles.title}>
              {game.name || 'Partie sans nom'}
            </Text>
            <Text variant="caption" color="secondary">
              {formatDate(game.updatedAt)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={[styles.deleteButton, { backgroundColor: theme.error + '20' }]}
          >
            <Text color="error" variant="caption" bold>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersContainer}>
          <Text variant="caption" color="secondary" style={styles.playersLabel}>
            {game.players.length} joueur{game.players.length > 1 ? 's' : ''}
          </Text>
          {winner && (
            <View style={styles.winnerContainer}>
              <Text variant="body" style={styles.winnerText}>
                🏆 {winner.name}: {winnerTotal} pts
              </Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  playersContainer: {
    marginTop: 8,
  },
  playersLabel: {
    marginBottom: 4,
  },
  winnerContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  winnerText: {
    fontWeight: '600',
  },
});

