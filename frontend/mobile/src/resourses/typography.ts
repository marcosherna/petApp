// src/theme/typografic.ts

import { PixelRatio } from "react-native";

/**
 * Escala de tamaños tipográficos basada en un sistema modular.
 * Los valores están en puntos (pt), no en píxeles.
 * Se recomienda usar con `fontSize` en componentes de texto.
 */
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
} as const;

/**
 * Mapeo de tamaños a `lineHeight` recomendado.
 * Usa 1.5x el tamaño para buena legibilidad en párrafos.
 */
export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 24,
  lg: 26,
  xl: 28,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 60,
  "6xl": 72,
} as const;

/**
 * Pesos de fuente disponibles (usando valores de `fontWeight`)
 * Se mapean a los valores válidos de React Native.
 */
export const fontWeights = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

/**
 * Tipos derivados para usar en componentes
 */
export type FontSizeKey = keyof typeof fontSizes;
export type FontWeightKey = keyof typeof fontWeights;
export type LineHeightKey = keyof typeof lineHeights;