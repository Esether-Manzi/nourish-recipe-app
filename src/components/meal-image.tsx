import { Image } from 'expo-image';
import { StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { MealSummary } from '@/lib/mealdb';

type Size = 'small' | 'medium' | 'full';

const EMOJI_SIZE: Record<Size, number> = { small: 34, medium: 56, full: 96 };

/** A meal photo from TheMealDB, or an emoji tile for built-in recipes that have no photo. */
export function MealImage({
  meal,
  size,
  style,
}: {
  meal: Pick<MealSummary, 'thumb' | 'emoji'>;
  size: Size;
  style: StyleProp<ImageStyle>;
}) {
  const theme = useTheme();

  if (!meal.thumb) {
    const fontSize = EMOJI_SIZE[size];
    return (
      <View style={[style, styles.emojiTile, { backgroundColor: theme.warningSoft }]}>
        <ThemedText style={{ fontSize, lineHeight: fontSize * 1.2 }}>{meal.emoji ?? '🍽️'}</ThemedText>
      </View>
    );
  }

  const uri = size === 'full' ? meal.thumb : `${meal.thumb}/${size}`;
  return (
    <Image
      source={{ uri }}
      placeholder={size === 'small' ? undefined : { uri: `${meal.thumb}/small` }}
      placeholderContentFit="cover"
      style={[style, { backgroundColor: theme.backgroundSelected }]}
      contentFit="cover"
      transition={200}
    />
  );
}

const styles = StyleSheet.create({
  emojiTile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
