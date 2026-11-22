import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Card, type Tone } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { EVERYDAY_LABEL, type EverydayLevel, type EverydayReport } from '@/lib/everyday';

export const EVERYDAY_TONE: Record<EverydayLevel, Tone> = {
  everyday: 'success',
  mostly: 'warning',
  special: 'accent',
};

/** "Can I make this?" summary: how many ingredients are easy to find, plus swaps for the rest. */
export function EverydayCard({ report }: { report: EverydayReport }) {
  const theme = useTheme();
  const label = EVERYDAY_LABEL[report.level];
  const tone = EVERYDAY_TONE[report.level];
  const share = report.total ? report.easy / report.total : 1;
  const fg = tone === 'success' ? theme.success : tone === 'warning' ? theme.warning : theme.accent;

  return (
    <Card tone={tone}>
      <ThemedText type="caption" style={[styles.overline, { color: fg }]}>
        Can I make this?
      </ThemedText>
      <ThemedText type="subtitle">
        {label.emoji} {label.label}
      </ThemedText>
      <ThemedText type="small">
        {report.easy} of {report.total} ingredients are easy to find in most markets and shops.
      </ThemedText>
      <View style={[styles.bar, { backgroundColor: theme.background }]}>
        <View
          style={{ width: `${share * 100}%`, height: '100%', backgroundColor: fg, borderRadius: Radius.pill }}
        />
      </View>

      {report.hard.length ? (
        <View style={{ gap: Spacing.two, marginTop: Spacing.one }}>
          <ThemedText type="smallBold">Harder to find, and what to use instead</ThemedText>
          {report.hard.map(({ ingredient, swap, unknown }) => (
            <View key={ingredient.name} style={[styles.swap, { backgroundColor: theme.background }]}>
              <ThemedText type="smallBold" style={{ textTransform: 'capitalize' }}>
                {ingredient.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {swap
                  ? `🔁 ${swap}`
                  : unknown
                    ? 'May be hard to find; try a similar local ingredient, or leave it out if it’s only a small amount.'
                    : ''}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 700,
  },
  bar: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  swap: {
    padding: Spacing.two + 2,
    borderRadius: Radius.medium,
    gap: 2,
  },
});
