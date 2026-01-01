import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useTheme } from "@/theme/useTheme";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ScoreInputProps {
  value: number | null;
  onValueChange: (value: number) => void;
  playerName: string;
}

const QUICK_VALUES = [0, 5, 20, 25, 50, 75, 100];

export const ScoreInput: React.FC<ScoreInputProps> = ({
  value,
  onValueChange,
  playerName,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const handleQuickSelect = (val: number) => {
    onValueChange(val);
    setModalVisible(false);
  };

  const handleCustomSubmit = () => {
    const numValue = parseInt(customValue, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onValueChange(numValue);
      setCustomValue("");
      setModalVisible(false);
    }
  };

  const handleCustomValueChange = (text: string) => {
    // Ne permettre que les nombres positifs
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomValue(numericValue);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor:
              value !== null ? theme.primary + "20" : theme.surface,
            borderColor: theme.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text variant="body" bold={value !== null}>
          {value !== null ? value.toString() : "0"}
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
              <Text
                variant="label"
                color="secondary"
                style={styles.sectionTitle}
              >
                Valeurs rapides
              </Text>
              <View style={styles.quickValuesGrid}>
                {QUICK_VALUES.map((val) => {
                  const isZero = val === 0;
                  return (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.quickValueButton,
                        isZero && styles.zeroButton,
                        {
                          backgroundColor: isZero
                            ? theme.primary + "40"
                            : theme.primary + "20",
                          borderColor: isZero ? theme.primary : theme.primary,
                          borderWidth: isZero ? 3 : 2,
                        },
                      ]}
                      onPress={() => handleQuickSelect(val)}
                    >
                      <View style={styles.buttonContent}>
                        <Text
                          variant={isZero ? "h3" : "body"}
                          bold
                          color={isZero ? "primary" : undefined}
                        >
                          {val}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.customInputContainer}>
              <Text
                variant="label"
                color="secondary"
                style={styles.sectionTitle}
              >
                Valeur personnalisée
              </Text>
              <Input
                value={customValue}
                onChangeText={handleCustomValueChange}
                placeholder="Entrez un score (nombre positif)"
                keyboardType="number-pad"
                style={styles.customInput}
              />
              <Button
                title="Valider"
                onPress={handleCustomSubmit}
                disabled={
                  !customValue ||
                  isNaN(parseInt(customValue, 10)) ||
                  parseInt(customValue, 10) < 0
                }
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  quickValuesContainer: {
    maxHeight: 300,
  },
  quickValuesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  quickValueButton: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  zeroButton: {
    width: "46%",
    aspectRatio: 2, // Ratio 2:1 pour un bouton deux fois plus large
  },
  buttonContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  customInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  customInput: {
    marginBottom: 12,
  },
  cancelButton: {
    marginTop: 16,
  },
});
