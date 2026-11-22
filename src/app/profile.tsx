import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Disclaimer } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { ALLERGEN_ORDER, ALLERGENS, GROUP_ORDER, GROUPS } from '@/data/groups';
import { useTheme } from '@/hooks/use-theme';
import { toggleProfileAllergen, toggleProfileGroup, useAppStore } from '@/store/app-store';

export default function ProfileScreen() {
  const theme = useTheme();
  const profile = useAppStore((s) => s.profile);

  return (
    <Screen inTabs={false} hasHeader>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="heading">Who are you cooking for?</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Pick anyone in your household. Recipes will flag ingredients that matter for them. Saved only on
          this device.
        </ThemedText>
      </View>

      <View style={{ gap: Spacing.two }}>
        {GROUP_ORDER.map((id) => {
          const group = GROUPS[id];
          const selected = profile.groups.includes(id);
          return (
            <Pressable
              key={id}
              onPress={() => toggleProfileGroup(id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: selected ? theme.accentSoft : theme.backgroundElement,
                  borderColor: selected ? theme.accent : 'transparent',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}>
              <ThemedText style={{ fontSize: 24, lineHeight: 30 }}>{group.emoji}</ThemedText>
              <View style={{ flex: 1 }}>
                <ThemedText type="smallBold">{group.label}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary">
                  {group.description}
                </ThemedText>
              </View>
              <ThemedText type="heading" themeColor={selected ? 'accent' : 'textSecondary'}>
                {selected ? '✓' : '+'}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: Spacing.two }}>
        <ThemedText type="heading">Allergies</ThemedText>
        <View style={styles.wrap}>
          {ALLERGEN_ORDER.map((id) => (
            <Chip
              key={id}
              label={ALLERGENS[id].label}
              emoji={ALLERGENS[id].emoji}
              selected={profile.allergens.includes(id)}
              onPress={() => toggleProfileAllergen(id)}
            />
          ))}
        </View>
      </View>

      <Disclaimer />
      <Button label="Done" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.large,
    borderWidth: 1.5,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
