import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/useTheme';
import { Game, Player } from '@/types';
import { getPlayerTotal } from '@/utils/calculations';

interface TotalRowProps {
  game: Game;
  players: Player[];
}

export const TotalRow: React.FC<TotalRowProps> = ({ game, players }) => {
  const theme = useTheme();

  return (
    <View style={[styles.row, { backgroundColor: theme.primary + '20' }]}>
      <View style={styles.labelCell}>
        <Text variant="h3" bold>
          Total
        </Text>
      </View>
      {players.map((player) => {
        const total = getPlayerTotal(game, player.id);
        return (
          <View key={player.id} style={styles.totalCell}>
            <Text variant="h3" bold>
              {total}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.2)',
  },
  labelCell: {
    flex: 1,
  },
  totalCell: {
    width: 80,
    alignItems: 'center',
  },
});

