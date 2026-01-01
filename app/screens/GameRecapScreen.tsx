import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/useTheme';
import { getGameStats, formatDate } from '@/utils/calculations';

export default function GameRecapScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { games } = useGameStore();

  const game = games.find((g) => g.id === id);

  if (!game) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text variant="h3">Partie introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const stats = getGameStats(game);
  const winner = stats.winner;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            🎉 Partie terminée !
          </Text>
          {game.name && (
            <Text variant="body" color="secondary" style={styles.subtitle}>
              {game.name}
            </Text>
          )}
          {game.finishedAt && (
            <Text variant="caption" color="secondary">
              {formatDate(game.finishedAt)}
            </Text>
          )}
        </View>

        {/* Gagnant */}
        {winner && (
          <Card style={[styles.winnerCard, { backgroundColor: theme.success + '20', borderColor: theme.success }]}>
            <View style={styles.winnerContent}>
              <Text variant="h2" style={styles.winnerTitle}>
                🏆 Gagnant
              </Text>
              <Text variant="h1" color="success" style={styles.winnerName}>
                {winner.name}
              </Text>
              <Text variant="h3" style={styles.winnerScore}>
                {stats.winnerScore} points
              </Text>
            </View>
          </Card>
        )}

        {/* Classement complet */}
        <Card style={styles.rankingCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Classement final
          </Text>
          <View style={styles.rankingList}>
            {stats.sortedPlayers.map((playerData, index) => {
              const isWinner = playerData.player.id === winner?.id;
              const position = index + 1;
              const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}.`;

              return (
                <View
                  key={playerData.player.id}
                  style={[
                    styles.rankingItem,
                    isWinner && { backgroundColor: theme.success + '10' },
                    { borderBottomColor: theme.border },
                  ]}
                >
                  <View style={styles.rankingPosition}>
                    <Text variant="h3" bold={isWinner}>
                      {medal}
                    </Text>
                  </View>
                  <View style={styles.rankingPlayer}>
                    <Text variant="body" bold={isWinner}>
                      {playerData.player.name}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {stats.maxRound} tour{stats.maxRound > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View style={styles.rankingScore}>
                    <Text variant="h3" bold={isWinner} color={isWinner ? 'success' : undefined}>
                      {playerData.total}
                    </Text>
                    <Text variant="caption" color="secondary">
                      pts
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Détails par tour */}
        <Card style={styles.detailsCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Détails par tour
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.detailsTable}>
              {/* En-tête */}
              <View style={[styles.detailsRow, styles.detailsHeader, { backgroundColor: theme.surface }]}>
                <View style={styles.detailsPlayerCell}>
                  <Text variant="label" bold>
                    Joueur
                  </Text>
                </View>
                {Array.from({ length: stats.maxRound }, (_, i) => i + 1).map((round) => (
                  <View key={round} style={styles.detailsRoundCell}>
                    <Text variant="label" bold>
                      T{round}
                    </Text>
                  </View>
                ))}
                <View style={styles.detailsTotalCell}>
                  <Text variant="label" bold>
                    Total
                  </Text>
                </View>
              </View>

              {/* Lignes des joueurs */}
              {stats.sortedPlayers.map((playerData) => {
                const isWinner = playerData.player.id === winner?.id;
                return (
                  <View
                    key={playerData.player.id}
                    style={[
                      styles.detailsRow,
                      isWinner && { backgroundColor: theme.success + '05' },
                    ]}
                  >
                    <View style={styles.detailsPlayerCell}>
                      <Text variant="body" bold={isWinner}>
                        {playerData.player.name}
                      </Text>
                    </View>
                    {playerData.rounds.map((score, roundIndex) => (
                      <View key={roundIndex} style={styles.detailsRoundCell}>
                        <Text variant="body" color={score === 0 ? 'secondary' : undefined}>
                          {score}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.detailsTotalCell}>
                      <Text variant="body" bold={isWinner} color={isWinner ? 'success' : undefined}>
                        {playerData.total}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <Button
          title="Retour à la partie"
          onPress={() => router.back()}
          variant="outline"
          size="large"
          style={styles.backButton}
        />
        <Button
          title="Retour à l'accueil"
          onPress={() => router.push('/screens/HomeScreen')}
          size="large"
          style={styles.homeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 4,
  },
  winnerCard: {
    marginBottom: 20,
    borderWidth: 2,
    padding: 24,
  },
  winnerContent: {
    alignItems: 'center',
  },
  winnerTitle: {
    marginBottom: 12,
  },
  winnerName: {
    marginBottom: 8,
  },
  winnerScore: {
    marginTop: 8,
  },
  rankingCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  rankingList: {
    gap: 0,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rankingPosition: {
    width: 50,
    alignItems: 'center',
  },
  rankingPlayer: {
    flex: 1,
    marginLeft: 12,
  },
  rankingScore: {
    alignItems: 'flex-end',
  },
  detailsCard: {
    marginBottom: 20,
  },
  detailsTable: {
    minWidth: '100%',
  },
  detailsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailsHeader: {
    borderBottomWidth: 2,
    paddingVertical: 16,
  },
  detailsPlayerCell: {
    width: 100,
    paddingHorizontal: 8,
  },
  detailsRoundCell: {
    width: 50,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  detailsTotalCell: {
    width: 60,
    alignItems: 'center',
    paddingHorizontal: 8,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  backButton: {
    marginBottom: 12,
  },
  homeButton: {
    width: '100%',
  },
});

