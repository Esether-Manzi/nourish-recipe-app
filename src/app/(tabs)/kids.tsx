import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MealRow } from '@/components/meal-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge, Card, Chip, Disclaimer, ErrorView, SectionHeader } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { Radius, Spacing } from '@/constants/theme';
import { INGREDIENTS } from '@/data/ingredients';
import { AGE_BANDS, KIDS_GOLDEN_RULES, KIDS_MEAL_PLAN, type AgeBandId } from '@/data/kids';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { analyzeRecipe } from '@/lib/health';
import { getMeal } from '@/lib/mealdb';

const SUPERFOODS = INGREDIENTS.filter((i) => i.kidSuperfood);

const todayIndex = () => (new Date().getDay() + 6) % 7; // Monday = 0

export default function KidsScreen() {
  const theme = useTheme();
  const [band, setBand] = useState<AgeBandId>('4-8');
  const [dayIndex, setDayIndex] = useState(todayIndex);
  const age = AGE_BANDS.find((b) => b.id === band)!;
  const day = KIDS_MEAL_PLAN[dayIndex];

  const meals = useAsync(() => Promise.all(day.meals.map((m) => getMeal(m.mealId))), [dayIndex]);

  return (
    <Screen>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="title">Kids’ kitchen</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Healthy meals and nutrition tips for children under 15.
        </ThemedText>
      </View>

      {/* Age band */}
      <View style={{ gap: Spacing.three }}>
        <View style={styles.segment}>
          {AGE_BANDS.map((b) => (
            <Chip
              key={b.id}
              label={b.label}
              emoji={b.emoji}
              selected={band === b.id}
              onPress={() => setBand(b.id)}
            />
          ))}
        </View>
        <Card tone="success">
          <ThemedText type="subtitle" themeColor="success">
            {age.emoji} {age.label}
          </ThemedText>
          <ThemedText type="small">{age.portion}</ThemedText>
          <View style={styles.statRow}>
            {age.daily.map((d) => (
              <View key={d.label} style={[styles.stat, { backgroundColor: theme.background }]}>
                <ThemedText type="caption" themeColor="textSecondary">
                  {d.label}
                </ThemedText>
                <ThemedText type="smallBold">{d.value}</ThemedText>
              </View>
            ))}
          </View>
          <ThemedText type="smallBold">Focus on</ThemedText>
          {age.focus.map((f) => (
            <ThemedText key={f} type="small">
              ✅ {f}
            </ThemedText>
          ))}
          <ThemedText type="smallBold" style={{ marginTop: Spacing.one }}>
            Watch out for
          </ThemedText>
          {age.watchOut.map((w) => (
            <ThemedText key={w} type="small">
              ⚠️ {w}
            </ThemedText>
          ))}
        </Card>
        <Card tone="warning">
          <ThemedText type="smallBold" themeColor="warning">
            👶 Under 12 months?
          </ThemedText>
          <ThemedText type="small">
            Babies need breast milk or formula as their main food until 12 months, with solids from around 6
            months. No honey, no added salt or sugar, no whole nuts, and no cow’s milk as a drink. Mash or cut
            everything soft and small.
          </ThemedText>
        </Card>
      </View>

      {/* Weekly plan */}
      <View style={{ gap: Spacing.three }}>
        <SectionHeader title="7-day meal plan" subtitle="Real recipes, with tips to make them kid-friendly" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
          {KIDS_MEAL_PLAN.map((d, i) => (
            <Pressable
              key={d.day}
              onPress={() => setDayIndex(i)}
              accessibilityRole="button"
              accessibilityState={{ selected: i === dayIndex }}
              accessibilityLabel={d.day}
              style={[
                styles.day,
                {
                  backgroundColor: i === dayIndex ? theme.accent : theme.backgroundElement,
                },
              ]}>
              <ThemedText type="smallBold" style={{ color: i === dayIndex ? theme.onAccent : theme.text }}>
                {d.short}
              </ThemedText>
              {i === todayIndex() ? (
                <ThemedText
                  type="caption"
                  style={{ color: i === dayIndex ? theme.onAccent : theme.accent, fontSize: 10 }}>
                  today
                </ThemedText>
              ) : null}
            </Pressable>
          ))}
        </ScrollView>

        {meals.status === 'error' ? <ErrorView message={meals.error.message} onRetry={meals.reload} /> : null}

        <View style={{ gap: Spacing.three }}>
          {day.meals.map((plan, i) => {
            // Ignore the previous day's data while the selected day loads.
            const meal = meals.status === 'success' ? meals.data[i] : undefined;
            const verdict = meal ? analyzeRecipe(meal.ingredients).kids.verdict : null;
            return (
              <View key={plan.mealId} style={{ gap: Spacing.two }}>
                <MealRow
                  meal={meal ?? { id: plan.mealId, name: plan.name, thumb: '' }}
                  overline={plan.slot}
                  detail={plan.why}
                  right={
                    verdict ? (
                      <ThemedText style={{ fontSize: 18 }}>
                        {verdict === 'great' ? '🌟' : verdict === 'adapt' ? '🛠️' : '⚠️'}
                      </ThemedText>
                    ) : null
                  }
                />
                {plan.kidTip ? (
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                    style={{ paddingHorizontal: Spacing.two }}>
                    💡 {plan.kidTip}
                  </ThemedText>
                ) : null}
              </View>
            );
          })}
          <Card>
            <ThemedText type="caption" themeColor="accent" style={styles.overline}>
              Snack idea
            </ThemedText>
            <ThemedText type="small">🍎 {day.snack}</ThemedText>
          </Card>
        </View>
      </View>

      {/* Superfoods */}
      <View style={{ gap: Spacing.three }}>
        <SectionHeader
          title="Kid superfoods"
          subtitle="Tap one to see why it’s good and how to serve it safely"
        />
        <View style={styles.superGrid}>
          {SUPERFOODS.map((food) => (
            <PressableLink
              key={food.id}
              href={{ pathname: '/ingredient/[id]', params: { id: food.id } }}
              style={({ pressed }) => [
                styles.superItem,
                { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.75 : 1 },
              ]}>
              <ThemedText style={{ fontSize: 28, lineHeight: 34 }}>{food.emoji}</ThemedText>
              <ThemedText type="caption" style={{ textAlign: 'center' }} numberOfLines={2}>
                {food.name}
              </ThemedText>
            </PressableLink>
          ))}
        </View>
      </View>

      {/* Golden rules */}
      <View style={{ gap: Spacing.three }}>
        <SectionHeader title="Golden rules" />
        {KIDS_GOLDEN_RULES.map((rule) => (
          <View key={rule.title} style={styles.rule}>
            <ThemedText style={{ fontSize: 24, lineHeight: 30 }}>{rule.emoji}</ThemedText>
            <View style={{ flex: 1 }}>
              <ThemedText type="smallBold">{rule.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {rule.text}
              </ThemedText>
            </View>
          </View>
        ))}
        <View style={styles.legend}>
          <Badge label="Great for kids" emoji="🌟" tone="success" />
          <Badge label="Needs small tweaks" emoji="🛠️" tone="warning" />
          <Badge label="Needs changes" emoji="⚠️" tone="danger" />
        </View>
      </View>

      <Disclaimer />
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginVertical: Spacing.one,
  },
  stat: {
    flexGrow: 1,
    flexBasis: 90,
    padding: Spacing.two,
    borderRadius: Radius.medium,
    gap: 2,
  },
  days: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  day: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 700,
  },
  superGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  superItem: {
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 88,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.two,
    gap: Spacing.one,
  },
  rule: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
