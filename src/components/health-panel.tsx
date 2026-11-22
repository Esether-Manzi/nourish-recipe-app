import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge, Card, Chip, Disclaimer, type Tone } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { Radius, Spacing } from '@/constants/theme';
import { ALLERGENS, GROUPS, LEVEL_LABEL, type CautionLevel } from '@/data/groups';
import { useTheme } from '@/hooks/use-theme';
import { hasProfileConflicts, type HealthReport } from '@/lib/health';
import { useAppStore } from '@/store/app-store';

export const LEVEL_TONE: Record<CautionLevel, Tone> = { avoid: 'danger', limit: 'warning', care: 'info' };

const VERDICT = {
  great: { tone: 'success' as Tone, emoji: '🌟' },
  adapt: { tone: 'warning' as Tone, emoji: '🛠️' },
  caution: { tone: 'danger' as Tone, emoji: '⚠️' },
};

function Bullet({ text, by }: { text: string; by?: string }) {
  return (
    <View style={styles.bullet}>
      <ThemedText type="small">•</ThemedText>
      <ThemedText type="small" style={{ flex: 1 }}>
        {text}
        {by ? (
          <ThemedText type="caption" themeColor="textSecondary">
            {'  '}
            {by}
          </ThemedText>
        ) : null}
      </ThemedText>
    </View>
  );
}

/** Personal alerts based on the user's saved health profile. */
export function ProfileAlerts({ report }: { report: HealthReport }) {
  const profile = useAppStore((s) => s.profile);
  const conflicts = useMemo(
    () => hasProfileConflicts(report, profile.groups, profile.allergens),
    [report, profile],
  );
  if (!conflicts.groups.length && !conflicts.allergens.length) return null;

  return (
    <Card tone="danger">
      <ThemedText type="smallBold" themeColor="danger">
        ⚠️ Heads up for your household
      </ThemedText>
      {conflicts.allergens.map((a) => (
        <ThemedText key={a.id} type="small">
          {ALLERGENS[a.id].emoji} Contains <ThemedText type="smallBold">{ALLERGENS[a.id].label}</ThemedText> (
          {a.ingredients.join(', ')})
        </ThemedText>
      ))}
      {conflicts.groups.map((w) => (
        <ThemedText key={w.group} type="small">
          {GROUPS[w.group].emoji} <ThemedText type="smallBold">{GROUPS[w.group].short}:</ThemedText>{' '}
          {LEVEL_LABEL[w.level].toLowerCase()}{' '}
          {[
            ...new Set(w.reasons.filter((r) => r.level !== 'care').map((r) => r.ingredient.toLowerCase())),
          ].join(', ')}
        </ThemedText>
      ))}
    </Card>
  );
}

export function HealthPanel({ report }: { report: HealthReport }) {
  const theme = useTheme();
  const [audience, setAudience] = useState<'kids' | 'adults'>('kids');
  const benefits = audience === 'kids' ? report.kidBenefits : report.adultBenefits;
  const verdict = VERDICT[report.kids.verdict];

  return (
    <View style={{ gap: Spacing.three }}>
      <Card tone={verdict.tone}>
        <ThemedText
          type="caption"
          themeColor={
            verdict.tone === 'success' ? 'success' : verdict.tone === 'warning' ? 'warning' : 'danger'
          }
          style={styles.overline}>
          Kids check
        </ThemedText>
        <ThemedText type="subtitle">
          {verdict.emoji} {report.kids.headline}
        </ThemedText>
        {report.kids.tips.map((tip) => (
          <Bullet key={tip} text={tip} />
        ))}
      </Card>

      {report.nutrients.length ? (
        <View style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold">Key nutrients</ThemedText>
          <View style={styles.wrap}>
            {report.nutrients.slice(0, 12).map((n) => (
              <Badge key={n} label={n} tone="success" />
            ))}
          </View>
        </View>
      ) : null}

      <Card>
        <View style={styles.rowBetween}>
          <ThemedText type="subtitle">💪 Health benefits</ThemedText>
        </View>
        <View style={styles.wrap}>
          <Chip
            label="For kids"
            emoji="🧒"
            selected={audience === 'kids'}
            onPress={() => setAudience('kids')}
          />
          <Chip
            label="For adults"
            emoji="🧑"
            selected={audience === 'adults'}
            onPress={() => setAudience('adults')}
          />
        </View>
        {benefits.length ? (
          benefits.slice(0, 8).map((b) => <Bullet key={b.text} text={b.text} by={b.ingredient} />)
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            No standout benefits found for this group.
          </ThemedText>
        )}
      </Card>

      {report.allergens.length ? (
        <Card>
          <ThemedText type="subtitle">🚫 Allergens</ThemedText>
          <View style={styles.wrap}>
            {report.allergens.map((a) => (
              <Badge key={a.id} label={ALLERGENS[a.id].label} emoji={ALLERGENS[a.id].emoji} tone="danger" />
            ))}
          </View>
          <ThemedText type="caption" themeColor="textSecondary">
            Based on ingredient names — always check product labels.
          </ThemedText>
        </Card>
      ) : null}

      {report.warnings.length ? (
        <Card>
          <ThemedText type="subtitle">🛡️ Who should take care</ThemedText>
          <ThemedText type="caption" themeColor="textSecondary">
            Vulnerable groups and what to watch for in this recipe.
          </ThemedText>
          <View style={{ gap: Spacing.two }}>
            {report.warnings.map((w) => (
              <GroupWarningRow key={w.group} warning={w} />
            ))}
          </View>
        </Card>
      ) : null}

      {report.sideEffects.length ? (
        <Card>
          <ThemedText type="subtitle">🩺 Possible side effects</ThemedText>
          {report.sideEffects.slice(0, 8).map((s) => (
            <Bullet key={s.text} text={s.text} by={s.ingredient} />
          ))}
        </Card>
      ) : null}

      <View style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold">Ingredient guides</ThemedText>
        <View style={styles.wrap}>
          {[...new Map(report.matched.map((m) => [m.info.id, m.info])).values()].map((info) => (
            <PressableLink
              key={info.id}
              href={{ pathname: '/ingredient/[id]', params: { id: info.id } }}
              style={({ pressed }) => [
                styles.ingredientLink,
                { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}>
              <ThemedText type="caption">
                {info.emoji} {info.name} ›
              </ThemedText>
            </PressableLink>
          ))}
        </View>
        {report.unmatched.length ? (
          <ThemedText type="caption" themeColor="textSecondary">
            Not in our guide yet: {report.unmatched.map((u) => u.name).join(', ')}
          </ThemedText>
        ) : null}
      </View>

      <Disclaimer />
    </View>
  );
}

function GroupWarningRow({ warning }: { warning: HealthReport['warnings'][number] }) {
  const theme = useTheme();
  const [open, setOpen] = useState(warning.level === 'avoid');
  const group = GROUPS[warning.group];
  return (
    <Pressable
      onPress={() => setOpen((o) => !o)}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      style={[styles.groupRow, { borderColor: theme.border, backgroundColor: theme.background }]}>
      <View style={styles.rowBetween}>
        <ThemedText type="smallBold" style={{ flex: 1 }}>
          {group.emoji} {group.label}
        </ThemedText>
        <Badge label={LEVEL_LABEL[warning.level]} tone={LEVEL_TONE[warning.level]} />
      </View>
      {open
        ? warning.reasons.map((r) => (
            <View key={r.infoId + r.note} style={styles.bullet}>
              <Badge label={r.ingredient} tone={LEVEL_TONE[r.level]} />
              <ThemedText type="small" style={{ flex: 1 }}>
                {r.note}
              </ThemedText>
            </View>
          ))
        : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 700,
  },
  bullet: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  groupRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.medium,
    padding: Spacing.two + 4,
    gap: Spacing.two,
  },
  ingredientLink: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 1,
  },
});
