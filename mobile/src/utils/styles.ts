// Utilitários de estilos para React Native com NativeWind
// Este arquivo fornece mapping entre Tailwind e estilos React Native

import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const screenHeight = height;
export const screenWidth = width;

// Preset de estilos comuns
export const commonStyles = StyleSheet.create({
  // Containers
  fullScreen: {
    flex: 1,
    height: screenHeight,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },

  // Texto
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 14,
  },
  smallText: {
    fontSize: 12,
  },

  // Padding/Margin
  p4: {
    padding: 16,
  },
  p6: {
    padding: 24,
  },
  m4: {
    margin: 16,
  },
  m6: {
    margin: 24,
  },

  // Border/Radius
  rounded: {
    borderRadius: 8,
  },
  roundedLg: {
    borderRadius: 12,
  },
  roundedXl: {
    borderRadius: 16,
  },
});

