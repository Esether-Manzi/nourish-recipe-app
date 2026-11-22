/**
 * App-wide design tokens. Colors are defined for light and dark mode and read through `useTheme()`.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1F1A17',
    background: '#FFFBF7',
    backgroundElement: '#F5EEE7',
    backgroundSelected: '#EADFD4',
    textSecondary: '#6E6259',
    border: '#E6DBD0',
    accent: '#D9481C',
    accentSoft: '#FCE4D9',
    onAccent: '#FFFFFF',
    success: '#2F7D4A',
    successSoft: '#DFF1E4',
    warning: '#A86400',
    warningSoft: '#FBEBCF',
    danger: '#B3261E',
    dangerSoft: '#F9DEDC',
    info: '#2A62A8',
    infoSoft: '#DDE8F6',
  },
  dark: {
    text: '#F6EFE9',
    background: '#151210',
    backgroundElement: '#231E1B',
    backgroundSelected: '#332C27',
    textSecondary: '#B8ACA2',
    border: '#3A322C',
    accent: '#FF7A4D',
    accentSoft: '#4A2416',
    onAccent: '#1A0D07',
    success: '#7FD39A',
    successSoft: '#1D3A26',
    warning: '#F2B65A',
    warningSoft: '#3E2C0F',
    danger: '#F2867E',
    dangerSoft: '#47201D',
    info: '#8DB8F0',
    infoSoft: '#1B2C42',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 14,
  large: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
