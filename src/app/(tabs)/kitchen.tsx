import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SavedList } from '@/components/saved-list';
import { Screen } from '@/components/screen';
import { ShoppingList } from '@/components/shopping-list';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppStore } from '@/store/app-store';

type Section = 'saved' | 'list';

export default function KitchenScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ section?: Section }>();
  const [section, setSection] = useState<Section>(params.section ?? 'saved');
  const savedCount = useAppStore((s) => s.favorites.length);
  const listLeft = useAppStore((s) => s.shopping.filter((i) => !i.checked).length);

  // Links like /kitchen?section=list switch to that section.
  const [linkedSection, setLinkedSection] = useState(params.section);
  if (params.section && params.section !== linkedSection) {
    setLinkedSection(params.section);
    setSection(params.section);
  }

  const segments: { id: Section; label: string; count: number }[] = [
    { id: 'saved', label: '♥ Saved', count: savedCount },
    { id: 'list', label: '🛒 Shopping list', count: listLeft },
  ];

  return (
    <Screen>
      <ThemedText type="title">My kitchen</ThemedText>

      <View style={[styles.segment, { backgroundColor: theme.backgroundElement }]}>
        {segments.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSection(s.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: section === s.id }}
            style={[styles.segmentItem, section === s.id && { backgroundColor: theme.background }]}>
            <ThemedText type="smallBold" themeColor={section === s.id ? 'text' : 'textSecondary'}>
              {s.label}
              {s.count ? ` (${s.count})` : ''}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {section === 'saved' ? <SavedList /> : <ShoppingList />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Radius.medium,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Radius.small + 2,
  },
});
