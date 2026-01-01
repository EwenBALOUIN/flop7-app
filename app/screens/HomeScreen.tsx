import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import { GameCard } from '@/components/game/GameCard';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { games, loadGames, deleteGame } = useGameStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const handleDeleteGame = (gameId: string, gameName: string) => {
    Alert.alert(
      'Supprimer la partie',
      `Êtes-vous sûr de vouloir supprimer "${gameName || 'cette partie'}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteGame(gameId),
        },
      ]
    );
  };

  const handleNewGame = () => {
    router.push('/screens/NewGameScreen');
  };

  const handleGamePress = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    if (game?.finishedAt) {
      router.push(`/screens/GameRecapScreen?id=${gameId}`);
    } else {
      router.push(`/screens/GameScreen?id=${gameId}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>
          Flip 7
        </Text>
        <Text variant="body" color="secondary">
          Gestionnaire de parties
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {games.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="h3" color="secondary" style={styles.emptyText}>
              Aucune partie
            </Text>
            <Text variant="body" color="secondary" style={styles.emptySubtext}>
              Créez votre première partie pour commencer !
            </Text>
          </View>
        ) : (
          games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={() => handleGamePress(game.id)}
              onDelete={() => handleDeleteGame(game.id, game.name)}
            />
          ))
        )}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <Button
          title="Nouvelle partie"
          onPress={handleNewGame}
          size="large"
          style={styles.newGameButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
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
  newGameButton: {
    width: '100%',
  },
});

