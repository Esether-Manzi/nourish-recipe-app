/** Small shared building blocks: chips, badges, cards, section headers and status views. */

import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const TONES: Record<Tone, { bg: ThemeColor; fg: ThemeColor }> = {
  neutral: { bg: 'backgroundElement', fg: 'text' },
  accent: { bg: 'accentSoft', fg: 'accent' },
  success: { bg: 'successSoft', fg: 'success' },
  warning: { bg: 'warningSoft', fg: 'warning' },
  danger: { bg: 'dangerSoft', fg: 'danger' },
  info: { bg: 'infoSoft', fg: 'info' },
};

export function Badge({ label, tone = 'neutral', emoji }: { label: string; tone?: Tone; emoji?: string }) {
  const theme = useTheme();
  const t = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: theme[t.bg] }]}>
      <ThemedText type="caption" style={{ color: theme[t.fg] }}>
        {emoji ? `${emoji} ` : ''}
        {label}
      </ThemedText>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  emoji,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  emoji?: string;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.accent : theme.backgroundElement,
          borderColor: selected ? theme.accent : theme.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <ThemedText type="smallBold" style={{ color: selected ? theme.onAccent : theme.text }}>
        {emoji ? `${emoji} ` : ''}
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  emoji,
  style,
  disabled,
  accessibilityLabel,
}: {
  label: string;
  onPress?: PressableProps['onPress'];
  variant?: 'primary' | 'secondary';
  emoji?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.accent : theme.backgroundElement,
          borderColor: primary ? theme.accent : theme.border,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        },
        style,
      ]}>
      <ThemedText type="smallBold" style={{ color: primary ? theme.onAccent : theme.text }}>
        {emoji ? `${emoji}  ` : ''}
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Card({
  children,
  style,
  tone,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: Tone;
}) {
  const theme = useTheme();
  const bg = tone ? theme[TONES[tone].bg] : theme.backgroundElement;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        <ThemedText type="heading">{title}</ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator color={theme.accent} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <ThemedText style={{ fontSize: 36 }}>🍳</ThemedText>
      <ThemedText type="subtitle">Something went wrong</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
        {message ?? 'Check your internet connection and try again.'}
      </ThemedText>
      {onRetry ? <Button label="Try again" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyView({
  emoji,
  title,
  message,
  action,
}: {
  emoji: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.center}>
      <ThemedText style={{ fontSize: 44, lineHeight: 52 }}>{emoji}</ThemedText>
      <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', maxWidth: 300 }}>
        {message}
      </ThemedText>
      {action}
    </View>
  );
}

export function Disclaimer({ compact }: { compact?: boolean }) {
  return (
    <Card tone="info" style={compact ? { padding: Spacing.two + 2 } : undefined}>
      <ThemedText type="caption" themeColor="info">
        ℹ️ General information from public health guidance (WHO, NHS, CDC, FDA, AAP) — not medical advice. If
        you are pregnant, managing a health condition, or feeding a baby, check with your doctor, dietitian or
        health visitor.
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 1,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  chip: {
    paddingHorizontal: Spacing.three - 2,
    paddingVertical: Spacing.two - 1,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  button: {
    minHeight: 46,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: Radius.large,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.five,
    minHeight: 280,
  },
});
