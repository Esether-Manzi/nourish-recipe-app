import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';

import { MealCard } from '@/components/meal-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyView, ErrorView, LoadingView } from '@/components/ui';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useAsync } from '@/hooks/use-async';
import { useTheme } from '@/hooks/use-theme';
import { filterByIngredient, searchMeals, type MealSummary } from '@/lib/mealdb';

type Mode = 'name' | 'ingredient';

const SUGGESTIONS: Record<Mode, string[]> = {
  name: ['Pancakes', 'Curry', 'Soup', 'Pasta', 'Salad', 'Rice'],
  ingredient: ['Chicken', 'Salmon', 'Spinach', 'Eggs', 'Lentils', 'Sweet Potatoes'],
};

function useDebounced<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ ingredient?: string }>();
  const [mode, setMode] = useState<Mode>(params.ingredient ? 'ingredient' : 'name');
  const [query, setQuery] = useState(params.ingredient ?? '');

  // Links from ingredient guides open this tab with an ingredient pre-filled.
  const [linkedIngredient, setLinkedIngredient] = useState(params.ingredient);
  if (params.ingredient && params.ingredient !== linkedIngredient) {
    setLinkedIngredient(params.ingredient);
    setMode('ingredient');
    setQuery(params.ingredient);
  }
  const term = useDebounced(query.trim());

  const contentWidth = Math.min(width, MaxContentWidth) - Spacing.three * 2;
  const columns = contentWidth > 560 ? 3 : 2;
  const cardWidth = (contentWidth - Spacing.three * (columns - 1)) / columns;

  const results = useAsync<MealSummary[]>(
    () =>
      term.length < 2 ? Promise.resolve([]) : mode === 'name' ? searchMeals(term) : filterByIngredient(term),
    [term, mode],
  );

  return (
    <Screen>
      <ThemedText type="title">Search</ThemedText>

      <View style={{ gap: Spacing.three }}>
        <View
          style={[styles.inputWrap, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <ThemedText>🔎</ThemedText>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={
              mode === 'name' ? 'Search dishes, e.g. “lasagne”' : 'What’s in your fridge? e.g. “chicken”'
            }
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Search recipes"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" hitSlop={10}>
              <ThemedText themeColor="textSecondary">✕</ThemedText>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.row}>
          <Chip label="By dish name" selected={mode === 'name'} onPress={() => setMode('name')} />
          <Chip
            label="By ingredient"
            selected={mode === 'ingredient'}
            onPress={() => setMode('ingredient')}
          />
        </View>
      </View>

      {term.length < 2 ? (
        <View style={{ gap: Spacing.two }}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Try
          </ThemedText>
          <View style={styles.row}>
            {SUGGESTIONS[mode].map((s) => (
              <Chip key={s} label={s} onPress={() => setQuery(s)} />
            ))}
          </View>
        </View>
      ) : results.status === 'loading' && !results.data?.length ? (
        <LoadingView label="Searching…" />
      ) : results.status === 'error' ? (
        <ErrorView message={results.error.message} onRetry={results.reload} />
      ) : results.data?.length ? (
        <View style={{ gap: Spacing.three }}>
          <ThemedText type="small" themeColor="textSecondary">
            {results.data.length} recipe{results.data.length === 1 ? '' : 's'}
          </ThemedText>
          <View style={styles.grid}>
            {results.data.map((meal) => (
              <MealCard key={meal.id} meal={meal} width={cardWidth} />
            ))}
          </View>
        </View>
      ) : (
        <EmptyView
          emoji="🥄"
          title="No recipes found"
          message={
            mode === 'ingredient'
              ? 'Try a single main ingredient like “beef” or “rice”.'
              : 'Try a shorter word, or search by ingredient instead.'
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.medium,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
});
