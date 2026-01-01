import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '@/store/gameStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/useTheme';
import { Player } from '@/types';

export default function NewGameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addGame } = useGameStore();
  const [gameName, setGameName] = useState('');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: '' },
    { id: '2', name: '' },
  ]);

  const handleAddPlayer = () => {
    setPlayers([...players, { id: Date.now().toString(), name: '' }]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length > 1) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const handlePlayerNameChange = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleCreateGame = () => {
    const validPlayers = players.filter((p) => p.name.trim() !== '');
    if (validPlayers.length < 1) {
      alert('Veuillez ajouter au moins 1 joueur avec un nom');
      return;
    }

    addGame({
      name: gameName.trim() || undefined,
      players: validPlayers,
      scores: [],
    });

    router.back();
  };

  const canCreate = players.filter((p) => p.name.trim() !== '').length >= 1;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="h2" style={styles.title}>
            Nouvelle partie
          </Text>
        </View>

        <Card style={styles.card}>
          <Input
            label="Nom de la partie (optionnel)"
            value={gameName}
            onChangeText={setGameName}
            placeholder="Ex: Soirée Flip 7"
          />
        </Card>

        <Card style={styles.card}>
          <View style={styles.playersHeader}>
            <Text variant="h3" style={styles.sectionTitle}>
              Joueurs ({players.length})
            </Text>
            <TouchableOpacity
              onPress={handleAddPlayer}
              style={[styles.addButton, { backgroundColor: theme.primary + '20' }]}
            >
              <Text color="primary" variant="body" bold>
                + Ajouter
              </Text>
            </TouchableOpacity>
          </View>

          {players.map((player, index) => (
            <View key={player.id} style={styles.playerRow}>
              <Input
                label={`Joueur ${index + 1}`}
                value={player.name}
                onChangeText={(name) => handlePlayerNameChange(player.id, name)}
                placeholder={`Nom du joueur ${index + 1}`}
                containerStyle={styles.playerInput}
              />
              {players.length > 1 && (
                <TouchableOpacity
                  onPress={() => handleRemovePlayer(player.id)}
                  style={[styles.removeButton, { backgroundColor: theme.error + '20' }]}
                >
                  <Text color="error" variant="body" bold>
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>

        <View style={styles.footer}>
          <Button
            title="Créer la partie"
            onPress={handleCreateGame}
            disabled={!canCreate}
            size="large"
            style={styles.createButton}
          />
          <Button
            title="Annuler"
            onPress={() => router.back()}
            variant="outline"
            size="large"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  card: {
    marginBottom: 20,
  },
  playersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  playerInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  footer: {
    marginTop: 20,
  },
  createButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 20,
  },
});

