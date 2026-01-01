import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/useTheme';

interface ScoreInputProps {
  value: number | null;
  onValueChange: (value: number) => void;
  playerName: string;
}

const QUICK_VALUES = [-50, -25, -10, 0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 75, 100];

export const ScoreInput: React.FC<ScoreInputProps> = ({
  value,
  onValueChange,
  playerName,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleQuickSelect = (val: number) => {
    onValueChange(val);
    setModalVisible(false);
  };

  const handleCustomSubmit = () => {
    const numValue = parseInt(customValue, 10);
    if (!isNaN(numValue)) {
      onValueChange(numValue);
      setCustomValue('');
      setModalVisible(false);
    }
  };

  const formatQuickValue = (val: number): string => {
    return val >= 0 ? `+${val}` : val.toString();
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: value !== null ? theme.primary + '20' : theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          variant="body"
          bold={value !== null}
          color={value !== null && value < 0 ? 'error' : undefined}
        >
          {value !== null ? (value >= 0 ? `+${value}` : value.toString()) : '—'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text variant="h3" style={styles.modalTitle}>
              Score pour {playerName}
            </Text>

            <ScrollView style={styles.quickValuesContainer}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                Valeurs rapides
              </Text>
              <View style={styles.quickValuesGrid}>
                {QUICK_VALUES.map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.quickValueButton,
                      {
                        backgroundColor: val < 0 ? theme.error + '20' : theme.primary + '20',
                        borderColor: val < 0 ? theme.error : theme.primary,
                      },
                    ]}
                    onPress={() => handleQuickSelect(val)}
                  >
                    <Text variant="body" bold color={val < 0 ? 'error' : undefined}>
                      {formatQuickValue(val)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.customInputContainer}>
              <Text variant="label" color="secondary" style={styles.sectionTitle}>
                Valeur personnalisée
              </Text>
              <Input
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="Entrez un score"
                keyboardType="numeric"
                style={styles.customInput}
              />
              <Button
                title="Valider"
                onPress={handleCustomSubmit}
                disabled={!customValue || isNaN(parseInt(customValue, 10))}
                size="small"
              />
            </View>

            <Button
              title="Annuler"
              onPress={() => setModalVisible(false)}
              variant="outline"
              size="small"
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  quickValuesContainer: {
    maxHeight: 300,
  },
  quickValuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickValueButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  customInput: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 16,
  },
});

