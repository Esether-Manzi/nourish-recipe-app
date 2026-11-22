import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { MealRow } from '@/components/meal-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Button, EmptyView } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { toggleFavorite, useAppStore } from '@/store/app-store';

export default function SavedScreen() {
  const favorites = useAppStore((s) => s.favorites);

  return (
    <Screen>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="title">Saved</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {favorites.length
            ? `${favorites.length} recipe${favorites.length === 1 ? '' : 's'} saved on this device`
            : 'Recipes you love, saved on this device.'}
        </ThemedText>
      </View>

      {favorites.length ? (
        <View style={{ gap: Spacing.three }}>
          {favorites.map((meal) => (
            <MealRow
              key={meal.id}
              meal={meal}
              right={
                <Pressable
                  onPress={() => toggleFavorite(meal)}
                  accessibilityLabel={`Remove ${meal.name} from saved`}
                  hitSlop={12}>
                  <ThemedText themeColor="accent" style={{ fontSize: 22 }}>
                    ♥
                  </ThemedText>
                </Pressable>
              }
            />
          ))}
        </View>
      ) : (
        <EmptyView
          emoji="💛"
          title="No saved recipes yet"
          message="Tap the heart on any recipe to keep it here."
          action={<Button label="Discover recipes" onPress={() => router.navigate('/')} />}
        />
      )}
    </Screen>
  );
}
