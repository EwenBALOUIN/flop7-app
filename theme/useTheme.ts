import { useColorScheme as useRNColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from './colors';

export const useTheme = (): ColorScheme => {
  const systemColorScheme = useRNColorScheme();
  const isDark = systemColorScheme === 'dark';
  return isDark ? darkColors : lightColors;
};

