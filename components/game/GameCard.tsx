import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/theme/useTheme";
import { Game } from "@/types";
import {
  formatDate,
  getPlayerTotal,
  getPlayersSortedByScore,
} from "@/utils/calculations";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface GameCardProps {
  game: Game;
  onPress: () => void;
  onDelete: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onPress,
  onDelete,
}) => {
  const theme = useTheme();
  const sortedPlayers = getPlayersSortedByScore(game);
  const winner = sortedPlayers[0];
  const winnerTotal = winner ? getPlayerTotal(game, winner.id) : 0;
  const isFinished = !!game.finishedAt || !!game.winnerId;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card
        style={
          isFinished
            ? {
                ...styles.card,
                borderWidth: 2,
                borderColor: theme.success,
                backgroundColor: theme.success + "05",
              }
            : styles.card
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text variant="h3" style={styles.title}>
                {game.name || "Partie sans nom"}
              </Text>
              {isFinished && (
                <View
                  style={[
                    styles.finishedBadge,
                    { backgroundColor: theme.success + "20" },
                  ]}
                >
                  <Text variant="caption" color="success" bold>
                    ✓ Terminée
                  </Text>
                </View>
              )}
            </View>
            {isFinished && (
              <View
                style={[
                  styles.finishedIndicator,
                  { backgroundColor: theme.success + "10" },
                ]}
              >
                <Text variant="caption" color="success">
                  🎉 Partie terminée
                </Text>
              </View>
            )}
            <Text variant="caption" color="secondary">
              {formatDate(game.updatedAt)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={[
              styles.deleteButton,
              { backgroundColor: theme.error + "20" },
            ]}
          >
            <Text color="error" variant="caption" bold>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playersContainer}>
          <Text variant="caption" color="secondary" style={styles.playersLabel}>
            {game.players.length} joueur{game.players.length > 1 ? "s" : ""}
          </Text>
          {winner && (
            <View style={styles.winnerContainer}>
              <Text
                variant="body"
                style={
                  isFinished
                    ? {
                        ...styles.winnerText,
                        color: theme.success,
                        fontWeight: "bold",
                      }
                    : styles.winnerText
                }
              >
                🏆 {winner.name}: {winnerTotal} pts
                {isFinished && " (Gagnant)"}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  finishedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  finishedIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
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
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  winnerText: {
    fontWeight: "600",
  },
});
