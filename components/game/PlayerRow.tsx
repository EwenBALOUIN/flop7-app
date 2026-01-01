import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/useTheme';
import { Player } from '@/types';

interface PlayerRowProps {
  player: Player;
  isHeader?: boolean;
  total?: number;
  isWinner?: boolean;
}

export const PlayerRow: React.FC<PlayerRowProps> = ({
  player,
  isHeader = false,
  total,
  isWinner = false,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        isHeader && { backgroundColor: theme.primary + '15' },
        isWinner && !isHeader && { backgroundColor: theme.success + '20' },
      ]}
    >
      <View style={styles.playerCell}>
        <Text variant={isHeader ? 'label' : 'body'} bold={isHeader || isWinner}>
          {player.name}
        </Text>
        {isWinner && !isHeader && (
          <Text variant="caption" color="success" style={styles.crown}>
            👑
          </Text>
        )}
      </View>
      {total !== undefined && (
        <View style={styles.totalCell}>
          <Text variant={isHeader ? 'label' : 'body'} bold={isHeader || isWinner}>
            {total}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  playerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  crown: {
    marginLeft: 8,
  },
  totalCell: {
    width: 80,
    alignItems: 'flex-end',
  },
});

