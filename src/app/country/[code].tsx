import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { MealCard } from '@/components/meal-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Card, EmptyView, ErrorView, LoadingView, SectionHeader } from '@/components/ui';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { countryByCode, flagOf } from '@/data/countries';
import { COUNTRY_NOTES, TRAVEL_FOOD_TIPS } from '@/data/travel';
import { useAsync } from '@/hooks/use-async';
import { filterByCountry } from '@/lib/mealdb';

export default function CountryScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const country = countryByCode(code);
  const { width } = useWindowDimensions();
  const [showTips, setShowTips] = useState(false);
  const meals = useAsync(
    () => (country ? filterByCountry(country.query, country.localArea) : Promise.resolve([])),
    [code],
  );

  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const columns = contentWidth > 560 ? 3 : 2;
  const cardWidth = (contentWidth - Spacing.three * (columns - 1)) / columns;

  if (!country) {
    return <EmptyView emoji="🧭" title="Country not found" message="Try picking one from the World tab." />;
  }

  const note = COUNTRY_NOTES[country.code];
  const tips = showTips ? TRAVEL_FOOD_TIPS : TRAVEL_FOOD_TIPS.slice(0, 2);

  return (
    <>
      <Stack.Screen options={{ title: country.name }} />
      <Screen inTabs={false} hasHeader>
        <View style={styles.hero}>
          <ThemedText style={{ fontSize: 56, lineHeight: 66 }}>{flagOf(country.code)}</ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText type="title">{country.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {country.region}
              {meals.data ? ` · ${meals.data.length} recipes` : ''}
            </ThemedText>
          </View>
        </View>

        {note ? (
          <Card tone="warning">
            <ThemedText type="smallBold" themeColor="warning">
              🍽️ Must try
            </ThemedText>
            <ThemedText type="small">{note.tryThis}</ThemedText>
            {note.etiquette ? (
              <>
                <ThemedText type="smallBold" themeColor="warning" style={{ marginTop: Spacing.one }}>
                  🤝 Table manners
                </ThemedText>
                <ThemedText type="small">{note.etiquette}</ThemedText>
              </>
            ) : null}
          </Card>
        ) : null}

        <Card tone="info">
          <ThemedText type="smallBold" themeColor="info">
            ✈️ Eating safely while travelling
          </ThemedText>
          {tips.map((tip) => (
            <View key={tip.title} style={styles.tip}>
              <ThemedText style={{ fontSize: 18 }}>{tip.emoji}</ThemedText>
              <ThemedText type="small" style={{ flex: 1 }}>
                <ThemedText type="smallBold">{tip.title}. </ThemedText>
                {tip.text}
              </ThemedText>
            </View>
          ))}
          <Pressable onPress={() => setShowTips((s) => !s)} hitSlop={8}>
            <ThemedText type="link" themeColor="info">
              {showTips ? 'Show fewer tips' : `Show all ${TRAVEL_FOOD_TIPS.length} tips`}
            </ThemedText>
          </Pressable>
        </Card>

        <View style={{ gap: Spacing.three }}>
          <SectionHeader title="Dishes" subtitle="Tap a dish for ingredients, health notes and local swaps" />
          {meals.status === 'loading' && !meals.data ? (
            <LoadingView label="Finding dishes…" />
          ) : meals.status === 'error' ? (
            <ErrorView message={meals.error.message} onRetry={meals.reload} />
          ) : meals.data?.length ? (
            <View style={styles.grid}>
              {meals.data.map((meal) => (
                <MealCard key={meal.id} meal={meal} width={cardWidth} />
              ))}
            </View>
          ) : (
            <EmptyView
              emoji="🍽️"
              title="No recipes yet"
              message="We’re still adding dishes from this country."
            />
          )}
        </View>
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
  tip: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
});
