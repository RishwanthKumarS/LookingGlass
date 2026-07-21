import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0d0d0f',
  surface: '#1a1a1d',
  text: '#f2f2f2',
  textMuted: '#9a9a9e',
  accent: '#7c9eff',
  border: '#2a2a2e',
};

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const fontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
};

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: fontSize.lg,
    color: colors.text,
  },
});