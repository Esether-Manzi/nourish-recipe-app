import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LEVEL_TONE } from '@/components/health-panel';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge, Card, Disclaimer, EmptyView } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { Spacing } from '@/constants/theme';
import { ALLERGENS, GROUPS, LEVEL_LABEL, LEVEL_RANK } from '@/data/groups';
import { INGREDIENTS_BY_ID } from '@/data/ingredients';
import { useTheme } from '@/hooks/use-theme';

export default function IngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const info = INGREDIENTS_BY_ID[id];

  if (!info) {
    return (
      <EmptyView emoji="🔍" title="Not in our guide" message="We don’t have health notes for this one yet." />
    );
  }

  const cautions = [...(info.cautions ?? [])].sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
  const searchTerm = info.match.find((m) => !m.includes(' ')) ?? info.match[0];

  return (
    <>
      <Stack.Screen options={{ title: info.name }} />
      <Screen inTabs={false} hasHeader>
        <View style={styles.hero}>
          <View style={[styles.emoji, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={{ fontSize: 48, lineHeight: 58 }}>{info.emoji}</ThemedText>
          </View>
          <View style={{ flex: 1, gap: Spacing.one }}>
            <ThemedText type="title">{info.name}</ThemedText>
            {info.allergens?.length ? (
              <View style={styles.wrap}>
                {info.allergens.map((a) => (
                  <Badge
                    key={a}
                    label={`Allergen: ${ALLERGENS[a].label}`}
                    emoji={ALLERGENS[a].emoji}
                    tone="danger"
                  />
                ))}
              </View>
            ) : null}
          </View>
        </View>

        {info.nutrients.length ? (
          <View style={{ gap: Spacing.two }}>
            <ThemedText type="smallBold">Rich in</ThemedText>
            <View style={styles.wrap}>
              {info.nutrients.map((n) => (
                <Badge key={n} label={n} tone="success" />
              ))}
            </View>
          </View>
        ) : null}

        <Card tone="success">
          <ThemedText type="subtitle" themeColor="success">
            🧒 Good for kids
          </ThemedText>
          {info.benefits.kids.length ? (
            info.benefits.kids.map((b) => (
              <ThemedText key={b} type="small">
                ✅ {b}
              </ThemedText>
            ))
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              No particular benefit for children — best kept as an occasional flavouring.
            </ThemedText>
          )}
        </Card>

        <Card tone="info">
          <ThemedText type="subtitle" themeColor="info">
            🧑 Good for adults
          </ThemedText>
          {info.benefits.adults.length ? (
            info.benefits.adults.map((b) => (
              <ThemedText key={b} type="small">
                ✅ {b}
              </ThemedText>
            ))
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              No particular health benefit — enjoy in moderation.
            </ThemedText>
          )}
        </Card>

        {info.sideEffects.length ? (
          <Card>
            <ThemedText type="subtitle">🩺 Possible side effects</ThemedText>
            {info.sideEffects.map((s) => (
              <ThemedText key={s} type="small">
                • {s}
              </ThemedText>
            ))}
          </Card>
        ) : null}

        <Card>
          <ThemedText type="subtitle">🛡️ Who should take care</ThemedText>
          {cautions.length ? (
            cautions.map((c) => (
              <View key={c.group + c.note} style={[styles.caution, { borderTopColor: theme.border }]}>
                <View style={styles.rowBetween}>
                  <ThemedText type="smallBold" style={{ flex: 1 }}>
                    {GROUPS[c.group].emoji} {GROUPS[c.group].label}
                  </ThemedText>
                  <Badge label={LEVEL_LABEL[c.level]} tone={LEVEL_TONE[c.level]} />
                </View>
                <ThemedText type="small" themeColor="textSecondary">
                  {c.note}
                </ThemedText>
              </View>
            ))
          ) : (
            <ThemedText type="small" themeColor="textSecondary">
              No specific group warnings — suitable for most people in normal amounts.
            </ThemedText>
          )}
        </Card>

        <PressableLink href={{ pathname: '/search', params: { ingredient: searchTerm } }}>
          <ThemedText type="link">🔎 Find recipes with {searchTerm} ›</ThemedText>
        </PressableLink>

        <Disclaimer />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  emoji: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
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
  caution: {
    gap: Spacing.one,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
