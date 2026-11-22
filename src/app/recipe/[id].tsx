import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { EVERYDAY_TONE, EverydayCard } from '@/components/everyday-card';
import { HealthPanel, ProfileAlerts } from '@/components/health-panel';
import { MealImage } from '@/components/meal-image';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Badge, Button, Card, Chip, EmptyView, ErrorView, LoadingView } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { Radius, Spacing } from '@/constants/theme';
import { ALLERGENS } from '@/data/groups';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { analyzeEveryday, EVERYDAY_LABEL, findAvailability, NO_OVEN_TIP } from '@/lib/everyday';
import { analyzeRecipe, findIngredientInfo } from '@/lib/health';
import { getMeal, ingredientImage } from '@/lib/mealdb';
import { addRecipeToShopping, toggleFavorite, useIsFavorite, useIsInShopping } from '@/store/app-store';

type Tab = 'ingredients' | 'method' | 'health';

export default function RecipeScreen() {
  const { id, tab: initialTab } = useLocalSearchParams<{ id: string; tab?: Tab }>();
  const theme = useTheme();
  const [tab, setTab] = useState<Tab>(initialTab ?? 'ingredients');
  const meal = useAsync(() => getMeal(id), [id]);
  const isFavorite = useIsFavorite(id);
  const inShopping = useIsInShopping(id);
  const report = useMemo(() => (meal.data ? analyzeRecipe(meal.data.ingredients) : null), [meal.data]);
  const everyday = useMemo(() => (meal.data ? analyzeEveryday(meal.data) : null), [meal.data]);

  if (meal.status === 'loading' && !meal.data) return <LoadingView label="Loading recipe…" />;
  if (meal.status === 'error') return <ErrorView message={meal.error.message} onRetry={meal.reload} />;
  if (!meal.data || !report || !everyday) {
    return (
      <EmptyView emoji="🤷" title="Recipe not found" message="It may have been removed from TheMealDB." />
    );
  }

  const recipe = meal.data;
  const verdict = report.kids.verdict;

  return (
    <>
      <Stack.Screen
        options={{
          title: recipe.name,
          headerRight: () => (
            <Pressable
              onPress={() => toggleFavorite(recipe)}
              accessibilityLabel={isFavorite ? 'Remove from saved' : 'Save recipe'}
              hitSlop={12}
              style={{ paddingHorizontal: Spacing.two }}>
              <ThemedText style={{ fontSize: 22, color: theme.accent }}>{isFavorite ? '♥' : '♡'}</ThemedText>
            </Pressable>
          ),
        }}
      />
      <Screen inTabs={false} hasHeader>
        <MealImage meal={recipe} size="full" style={styles.hero} />

        <View style={{ gap: Spacing.two }}>
          <View style={styles.wrap}>
            {recipe.category ? <Badge label={recipe.category} tone="accent" /> : null}
            {recipe.area ? <Badge label={recipe.area} /> : null}
            <Badge
              label={EVERYDAY_LABEL[everyday.level].short}
              emoji={EVERYDAY_LABEL[everyday.level].emoji}
              tone={EVERYDAY_TONE[everyday.level]}
            />
            <Badge
              label={
                verdict === 'great'
                  ? 'Kid-friendly'
                  : verdict === 'adapt'
                    ? 'Kids: small tweaks'
                    : 'Kids: needs changes'
              }
              emoji={verdict === 'great' ? '🌟' : verdict === 'adapt' ? '🛠️' : '⚠️'}
              tone={verdict === 'great' ? 'success' : verdict === 'adapt' ? 'warning' : 'danger'}
            />
          </View>
          <ThemedText type="title">{recipe.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
            {report.allergens.length
              ? ` · Contains ${report.allergens.map((a) => ALLERGENS[a.id].label.toLowerCase()).join(', ')}`
              : ''}
          </ThemedText>
          {recipe.about ? <ThemedText>{recipe.about}</ThemedText> : null}
        </View>

        <View style={styles.actions}>
          <Button
            label="Start cooking"
            emoji="👩‍🍳"
            style={{ flex: 1 }}
            disabled={!recipe.steps.length}
            onPress={() => router.push({ pathname: '/cook/[id]', params: { id: recipe.id } })}
          />
          <Button
            label={inShopping ? 'On your list' : 'Add to list'}
            emoji={inShopping ? '✓' : '🛒'}
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => addRecipeToShopping(recipe)}
          />
        </View>

        <ProfileAlerts report={report} />

        <View style={[styles.tabs, { backgroundColor: theme.backgroundElement }]}>
          {(['ingredients', 'method', 'health'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t }}
              style={[styles.tab, tab === t && { backgroundColor: theme.background }]}>
              <ThemedText type="smallBold" themeColor={tab === t ? 'text' : 'textSecondary'}>
                {t === 'ingredients' ? 'Ingredients' : t === 'method' ? 'Method' : '❤️ Health'}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {tab === 'ingredients' ? (
          <View style={{ gap: Spacing.one }}>
            <EverydayCard report={everyday} />
            {recipe.ingredients.map((ing, index) => {
              const info = findIngredientInfo(ing.name);
              const swap =
                findAvailability(ing.name)?.tier === 'specialty'
                  ? findAvailability(ing.name)?.swap
                  : undefined;
              const row = (
                <View style={[styles.ingredient, { borderBottomColor: theme.border }]}>
                  <Image
                    source={{ uri: ingredientImage(ing.name) }}
                    style={[styles.ingredientImage, { backgroundColor: theme.backgroundElement }]}
                    contentFit="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="small" style={{ textTransform: 'capitalize' }}>
                      {ing.name}
                    </ThemedText>
                    {swap ? (
                      <ThemedText type="caption" themeColor="warning">
                        🔁 Swap: {swap}
                      </ThemedText>
                    ) : null}
                    {info ? (
                      <ThemedText type="caption" themeColor="accent">
                        {info.emoji} Health guide ›
                      </ThemedText>
                    ) : null}
                  </View>
                  <ThemedText type="smallBold" themeColor="textSecondary">
                    {ing.measure}
                  </ThemedText>
                </View>
              );
              return info ? (
                <PressableLink
                  key={`${ing.name}-${index}`}
                  href={{ pathname: '/ingredient/[id]', params: { id: info.id } }}>
                  {row}
                </PressableLink>
              ) : (
                <View key={`${ing.name}-${index}`}>{row}</View>
              );
            })}
          </View>
        ) : null}

        {tab === 'method' ? (
          <View style={{ gap: Spacing.three }}>
            {everyday.needsOven ? (
              <Card tone="warning">
                <ThemedText type="smallBold" themeColor="warning">
                  🔥 Cooking without an oven
                </ThemedText>
                <ThemedText type="small">{NO_OVEN_TIP}</ThemedText>
              </Card>
            ) : null}
            {recipe.steps.map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: theme.accentSoft }]}>
                  <ThemedText type="smallBold" themeColor="accent">
                    {i + 1}
                  </ThemedText>
                </View>
                <ThemedText style={{ flex: 1 }}>{step}</ThemedText>
              </View>
            ))}
            <View style={styles.wrap}>
              {recipe.youtube ? (
                <Chip
                  label="Watch video"
                  emoji="▶️"
                  onPress={() => WebBrowser.openBrowserAsync(recipe.youtube!)}
                />
              ) : null}
              {recipe.source ? (
                <Chip
                  label="Original source"
                  emoji="🔗"
                  onPress={() => WebBrowser.openBrowserAsync(recipe.source!)}
                />
              ) : null}
            </View>
          </View>
        ) : null}

        {tab === 'health' ? <HealthPanel report={report} /> : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 380,
    borderRadius: Radius.large,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tabs: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.small + 2,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    borderRadius: Radius.small,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
