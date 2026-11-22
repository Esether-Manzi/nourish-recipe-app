import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MealImage } from '@/components/meal-image';
import { PressableLink } from '@/components/pressable-link';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { MealSummary } from '@/lib/mealdb';

const meta = (meal: MealSummary) => [meal.category, meal.area].filter(Boolean).join(' · ');

/** Image-first card used in grids and carousels. */
export function MealCard({ meal, width, badge }: { meal: MealSummary; width?: number; badge?: string }) {
  const theme = useTheme();
  return (
    <PressableLink
      href={{ pathname: '/recipe/[id]', params: { id: meal.id } }}
      accessibilityLabel={meal.name}
      style={({ pressed }) => [
        styles.card,
        width ? { width } : { flex: 1 },
        { opacity: pressed ? 0.85 : 1 },
      ]}>
      <View>
        <MealImage meal={meal} size="medium" style={styles.image} />
        {badge || meal.local ? (
          <View style={[styles.badge, { backgroundColor: theme.background }]}>
            <ThemedText type="caption">{badge ?? '🏠 Home-style'}</ThemedText>
          </View>
        ) : null}
      </View>
      <ThemedText type="smallBold" numberOfLines={2}>
        {meal.name}
      </ThemedText>
      {meta(meal) ? (
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
          {meta(meal)}
        </ThemedText>
      ) : null}
    </PressableLink>
  );
}

/** Horizontal row used in lists (favorites, meal plan). */
export function MealRow({
  meal,
  overline,
  detail,
  right,
}: {
  meal: MealSummary;
  overline?: string;
  detail?: string;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <PressableLink
      href={{ pathname: '/recipe/[id]', params: { id: meal.id } }}
      accessibilityLabel={meal.name}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.85 : 1 },
      ]}>
      <MealImage meal={meal} size="small" style={styles.rowImage} />
      <View style={{ flex: 1, gap: 2 }}>
        {overline ? (
          <ThemedText type="caption" themeColor="accent" style={styles.overline}>
            {overline}
          </ThemedText>
        ) : null}
        <ThemedText type="smallBold" numberOfLines={2}>
          {meal.name}
        </ThemedText>
        {(detail ?? meta(meal)) ? (
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={3}>
            {detail ?? meta(meal)}
          </ThemedText>
        ) : null}
      </View>
      {right}
    </PressableLink>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.large,
    marginBottom: Spacing.one,
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.two,
    paddingRight: Spacing.three,
    borderRadius: Radius.large,
  },
  rowImage: {
    width: 76,
    height: 76,
    borderRadius: Radius.medium,
  },
  overline: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: 700,
  },
});
