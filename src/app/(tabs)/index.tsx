import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { MealCard } from '@/components/meal-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge, Chip, ErrorView, LoadingView, SectionHeader } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { LOCAL_RECIPES } from '@/data/local-recipes';
import { analyzeEveryday, EVERYDAY_LABEL } from '@/lib/everyday';
import { analyzeRecipe } from '@/lib/health';
import {
  filterByCategory,
  getCategories,
  getMeal,
  getRandomMeal,
  toSummaryOf,
  type MealSummary,
} from '@/lib/mealdb';
import { useAppStore } from '@/store/app-store';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DiscoverScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const columns = contentWidth > 560 ? 3 : 2;
  const cardWidth = (contentWidth - Spacing.three * (columns - 1)) / columns;
  const profileCount = useAppStore((s) => s.profile.groups.length + s.profile.allergens.length);

  const featured = useAsync(getRandomMeal, []);
  const categories = useAsync(getCategories, []);
  const [category, setCategory] = useState('Breakfast');
  const [everydayOnly, setEverydayOnly] = useState(false);
  const meals = useAsync(() => filterByCategory(category), [category]);

  // The everyday filter needs each recipe's ingredients, so it looks up the first few recipes
  // (requests are queued in the API client to stay within TheMealDB's rate limit).
  const visible = (meals.data ?? []).slice(0, 24);
  const everyday = useAsync(async () => {
    if (!everydayOnly || meals.status !== 'success') return [];
    const details = await Promise.all(visible.slice(0, 16).map((m) => getMeal(m.id).catch(() => null)));
    return details
      .filter((d) => d !== null)
      .map((d) => ({ meal: toSummaryOf(d), level: analyzeEveryday(d).level }))
      .filter((r) => r.level !== 'special');
  }, [everydayOnly, category, meals.status]);
  const grid: { meal: MealSummary; badge?: string }[] = everydayOnly
    ? (everyday.data ?? []).map((r) => ({
        meal: r.meal,
        badge: `${EVERYDAY_LABEL[r.level].emoji} ${EVERYDAY_LABEL[r.level].short}`,
      }))
    : visible.map((meal) => ({ meal }));

  const featuredMeal = featured.data;
  const featuredReport = featuredMeal ? analyzeRecipe(featuredMeal.ingredients) : null;

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText type="small" themeColor="textSecondary">
            {greeting()} 👋
          </ThemedText>
          <ThemedText type="title">What’s cooking?</ThemedText>
        </View>
        <PressableLink
          href="/profile"
          accessibilityLabel="Health profile"
          style={({ pressed }) => [
            styles.profileButton,
            { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={{ fontSize: 20 }}>🩺</ThemedText>
          {profileCount ? (
            <View style={[styles.dot, { backgroundColor: theme.accent }]}>
              <ThemedText type="caption" style={{ color: theme.onAccent, fontSize: 10, lineHeight: 14 }}>
                {profileCount}
              </ThemedText>
            </View>
          ) : null}
        </PressableLink>
      </View>

      {featured.status === 'error' && !featuredMeal ? (
        <ErrorView message={featured.error.message} onRetry={featured.reload} />
      ) : featuredMeal ? (
        <PressableLink
          href={{ pathname: '/recipe/[id]', params: { id: featuredMeal.id } }}
          style={({ pressed }) => [styles.hero, { opacity: pressed ? 0.9 : 1 }]}>
          <Image
            source={{ uri: featuredMeal.thumb }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={250}
          />
          <View style={styles.heroShade} />
          <View style={styles.heroText}>
            <Badge label="Try something new" tone="accent" emoji="✨" />
            <ThemedText type="heading" style={{ color: '#fff' }} numberOfLines={2}>
              {featuredMeal.name}
            </ThemedText>
            <ThemedText type="caption" style={{ color: '#ffffffd0' }}>
              {featuredMeal.area} · {featuredMeal.category}
              {featuredReport
                ? `  ·  ${featuredReport.kids.verdict === 'great' ? '🌟 Kid-friendly' : featuredReport.kids.verdict === 'adapt' ? '🛠️ Kid-friendly with tweaks' : '⚠️ Adults'}`
                : ''}
            </ThemedText>
          </View>
        </PressableLink>
      ) : (
        <View style={[styles.hero, { backgroundColor: theme.backgroundElement }]} />
      )}
      {featuredMeal ? (
        <Pressable onPress={featured.reload} style={{ alignSelf: 'flex-end', marginTop: -Spacing.three }}>
          <ThemedText type="link">🎲 Shuffle</ThemedText>
        </Pressable>
      ) : null}

      <PressableLink
        href="/kids"
        style={({ pressed }) => [
          styles.kidsBanner,
          { backgroundColor: theme.successSoft, opacity: pressed ? 0.85 : 1 },
        ]}>
        <ThemedText style={{ fontSize: 34, lineHeight: 40 }}>🥕</ThemedText>
        <View style={{ flex: 1 }}>
          <ThemedText type="subtitle" themeColor="success">
            Kids’ healthy meal plan
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            A 7-day menu for under-15s, with tips by age.
          </ThemedText>
        </View>
        <ThemedText type="heading" themeColor="success">
          ›
        </ThemedText>
      </PressableLink>

      <View style={{ gap: Spacing.three }}>
        <SectionHeader title="🇺🇬 Home-style Ugandan" subtitle="Everyday market ingredients, simple steps" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {LOCAL_RECIPES.map((r) => (
            <MealCard key={r.id} meal={toSummaryOf(r)} width={150} badge="🧺 Everyday" />
          ))}
        </ScrollView>
      </View>

      <View style={{ gap: Spacing.three }}>
        <SectionHeader title="Browse by category" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {(categories.data ?? []).map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              selected={c.name === category}
              onPress={() => setCategory(c.name)}
            />
          ))}
        </ScrollView>

        <View style={styles.chips}>
          <Chip
            label="Everyday ingredients only"
            emoji="🧺"
            selected={everydayOnly}
            onPress={() => setEverydayOnly((v) => !v)}
          />
        </View>

        {meals.status === 'loading' && !meals.data ? (
          <LoadingView label={`Finding ${category.toLowerCase()} recipes…`} />
        ) : meals.status === 'error' ? (
          <ErrorView message={meals.error.message} onRetry={meals.reload} />
        ) : everydayOnly && everyday.status === 'loading' ? (
          <LoadingView label="Checking which recipes use everyday ingredients…" />
        ) : everydayOnly && everyday.status === 'error' ? (
          <ErrorView message={everyday.error.message} onRetry={everyday.reload} />
        ) : grid.length ? (
          <View style={[styles.grid, { opacity: meals.status === 'loading' ? 0.5 : 1 }]}>
            {grid.map(({ meal, badge }) => (
              <MealCard key={meal.id} meal={meal} width={cardWidth} badge={badge} />
            ))}
          </View>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            No {category.toLowerCase()} recipes here use only everyday ingredients — try another category, or
            open a recipe to see swaps.
          </ThemedText>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  hero: {
    height: 260,
    borderRadius: Radius.large,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  heroText: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  kidsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
  },
  carousel: {
    gap: Spacing.three,
    paddingRight: Spacing.three,
  },
  chips: {
    gap: Spacing.two,
    paddingRight: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
});
