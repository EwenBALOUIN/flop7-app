import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/theme/useTheme';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'error' | 'success';
  style?: TextStyle;
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  bold = false,
}) => {
  const theme = useTheme();

  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { fontSize: 32, fontWeight: 'bold' };
      case 'h2':
        return { fontSize: 24, fontWeight: 'bold' };
      case 'h3':
        return { fontSize: 20, fontWeight: '600' };
      case 'label':
        return { fontSize: 14, fontWeight: '600' };
      case 'caption':
        return { fontSize: 12 };
      default:
        return { fontSize: 16 };
    }
  };

  const getColor = (): string => {
    if (color) {
      switch (color) {
        case 'primary':
          return theme.primary;
        case 'secondary':
          return theme.textSecondary;
        case 'error':
          return theme.error;
        case 'success':
          return theme.success;
        default:
          return theme.text;
      }
    }
    return theme.text;
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: getColor() },
        bold && { fontWeight: 'bold' },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};

