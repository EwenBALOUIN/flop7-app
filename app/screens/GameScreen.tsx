import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ScoreInput } from '@/components/game/ScoreInput';
import { useTheme } from '@/theme/useTheme';
import {
  getMaxRound,
  getRoundScores,
  getPlayersSortedByScore,
  getPlayerTotal,
} from '@/utils/calculations';

export default function GameScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { games, addScore, deleteScore, updateScore } = useGameStore();
  const [currentRound, setCurrentRound] = useState(1);
  const [roundScores, setRoundScores] = useState<Record<string, number>>({});
  const [animationValue] = useState(new Animated.Value(1));

  const game = games.find((g) => g.id === id);

  useEffect(() => {
    if (game) {
      const maxRound = getMaxRound(game);
      setCurrentRound(maxRound + 1);
      const scores = getRoundScores(game, maxRound + 1);
      setRoundScores(scores);
    }
  }, [game]);

  if (!game) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text variant="h3">Partie introuvable</Text>
        <Button title="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const sortedPlayers = getPlayersSortedByScore(game);
  const maxRound = getMaxRound(game);
  const allRounds = Array.from({ length: maxRound }, (_, i) => i + 1);

  const handleScoreChange = (playerId: string, value: number) => {
    setRoundScores({ ...roundScores, [playerId]: value });
  };

  const handleSaveRound = () => {
    const allScoresSet = sortedPlayers.every((player) => roundScores[player.id] !== undefined);
    if (!allScoresSet) {
      Alert.alert('Scores incomplets', 'Veuillez entrer un score pour tous les joueurs');
      return;
    }

    // Vérifier si c'est un tour existant ou nouveau
    const existingScores = game.scores.filter((s) => s.round === currentRound);
    const isExistingRound = existingScores.length > 0;

    if (isExistingRound) {
      // Mettre à jour les scores existants
      sortedPlayers.forEach((player) => {
        const value = roundScores[player.id] || 0;
        const existingScore = existingScores.find((s) => s.playerId === player.id);
        if (existingScore) {
          // Mettre à jour le score existant
          updateScore(game.id, existingScore.id, value);
        } else {
          // Ajouter un nouveau score si manquant
          addScore(game.id, currentRound, player.id, value);
        }
      });
    } else {
      // Créer un nouveau tour
      sortedPlayers.forEach((player) => {
        const value = roundScores[player.id] || 0;
        addScore(game.id, currentRound, player.id, value);
      });
    }

    // Animation
    Animated.sequence([
      Animated.timing(animationValue, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Si c'est un nouveau tour, passer au suivant
    if (!isExistingRound) {
      setCurrentRound(currentRound + 1);
      setRoundScores({});
    }
  };

  const handleViewRound = (round: number) => {
    const scores = getRoundScores(game, round);
    setRoundScores(scores);
    setCurrentRound(round);
  };

  const handleDeleteRound = (round: number) => {
    Alert.alert(
      'Supprimer le tour',
      `Êtes-vous sûr de vouloir supprimer le tour ${round} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const roundScoresToDelete = game.scores.filter((s) => s.round === round);
            roundScoresToDelete.forEach((score) => {
              deleteScore(game.id, score.id);
            });
            if (currentRound === round) {
              setRoundScores({});
            }
          },
        },
      ]
    );
  };

  const winner = sortedPlayers[0];
  const winnerTotal = winner ? getPlayerTotal(game, winner.id) : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text variant="body" color="primary" bold>
            ← Retour
          </Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text variant="h2" style={styles.title}>
            {game.name || 'Partie sans nom'}
          </Text>
          {winner && (
            <Text variant="caption" color="secondary">
              🏆 {winner.name} mène avec {winnerTotal} pts
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Historique des tours */}
        {allRounds.length > 0 && (
          <Card style={styles.historyCard}>
            <Text variant="h3" style={styles.sectionTitle}>
              Historique des tours
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.roundsContainer}>
                {allRounds.map((round) => {
                  const roundTotal = sortedPlayers.reduce((sum, player) => {
                    const score = game.scores.find(
                      (s) => s.round === round && s.playerId === player.id
                    );
                    return sum + (score?.value || 0);
                  }, 0);
                  return (
                    <TouchableOpacity
                      key={round}
                      onPress={() => handleViewRound(round)}
                      onLongPress={() => handleDeleteRound(round)}
                      style={[
                        styles.roundButton,
                        {
                          backgroundColor:
                            currentRound === round ? theme.primary : theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text
                        variant="body"
                        bold={currentRound === round}
                        color={currentRound === round ? 'primary' : undefined}
                      >
                        Tour {round}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {roundTotal} pts
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Card>
        )}

        {/* Tour actuel */}
        <Card style={styles.currentRoundCard}>
          <Text variant="h3" style={styles.sectionTitle}>
            Tour {currentRound}
          </Text>

          <View style={styles.playersHeader}>
            <View style={styles.playerHeaderCell}>
              <Text variant="label" bold>
                Joueur
              </Text>
            </View>
            <View style={styles.totalHeaderCell}>
              <Text variant="label" bold>
                Total
              </Text>
            </View>
            <View style={styles.scoreHeaderCell}>
              <Text variant="label" bold>
                Score
              </Text>
            </View>
          </View>

          {sortedPlayers.map((player, index) => {
            const isWinner = index === 0 && getPlayerTotal(game, player.id) > 0;
            const total = getPlayerTotal(game, player.id);
            return (
              <View
                key={player.id}
                style={[
                  styles.playerScoreRow,
                  isWinner && { backgroundColor: theme.success + '10', borderRadius: 8, padding: 8 },
                ]}
              >
                <View style={styles.playerCell}>
                  <View style={styles.playerInfo}>
                    <Text variant="body" bold={isWinner}>
                      {player.name}
                    </Text>
                    {isWinner && (
                      <Text variant="caption" color="success" style={styles.crown}>
                        👑
                      </Text>
                    )}
                  </View>
                </View>
                <Animated.View
                  style={[
                    styles.totalCell,
                    { transform: [{ scale: animationValue }] },
                  ]}
                >
                  <Text variant="body" bold={isWinner}>
                    {total}
                  </Text>
                </Animated.View>
                <View style={styles.scoreCell}>
                  <ScoreInput
                    value={roundScores[player.id] ?? null}
                    onValueChange={(value) => handleScoreChange(player.id, value)}
                    playerName={player.name}
                  />
                </View>
              </View>
            );
          })}

          <Button
            title={
              game.scores.filter((s) => s.round === currentRound).length > 0
                ? 'Modifier le tour'
                : 'Enregistrer le tour'
            }
            onPress={handleSaveRound}
            disabled={!sortedPlayers.every((p) => roundScores[p.id] !== undefined)}
            size="large"
            style={styles.saveButton}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginBottom: 12,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  historyCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  roundsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roundButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  currentRoundCard: {
    marginBottom: 20,
  },
  playersHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 8,
  },
  playerHeaderCell: {
    flex: 1,
  },
  totalHeaderCell: {
    width: 80,
    alignItems: 'center',
  },
  scoreHeaderCell: {
    width: 100,
    alignItems: 'center',
  },
  playerScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  playerCell: {
    flex: 1,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crown: {
    marginLeft: 8,
  },
  totalCell: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCell: {
    width: 100,
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
});

