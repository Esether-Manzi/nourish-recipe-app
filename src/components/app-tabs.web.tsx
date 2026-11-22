import {
  TabList,
  TabSlot,
  TabTrigger,
  Tabs,
  type TabListProps,
  type TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TABS = [
  { name: 'index', href: '/', label: 'Discover', emoji: '🍽️' },
  { name: 'search', href: '/search', label: 'Search', emoji: '🔎' },
  { name: 'kids', href: '/kids', label: 'Kids', emoji: '🧒' },
  { name: 'saved', href: '/saved', label: 'Saved', emoji: '♥' },
  { name: 'shopping', href: '/shopping', label: 'Shopping', emoji: '🛒' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <BottomBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton emoji={tab.emoji}>{tab.label}</TabButton>
            </TabTrigger>
          ))}
        </BottomBar>
      </TabList>
    </Tabs>
  );
}

function BottomBar(props: TabListProps) {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={[styles.bar, { backgroundColor: theme.background, borderTopColor: theme.border }]}
    />
  );
}

function TabButton({
  children,
  isFocused,
  emoji,
  ref: _ref,
  ...props
}: TabTriggerSlotProps & { emoji: string }) {
  const theme = useTheme();
  return (
    <Pressable {...props} style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}>
      <View style={[styles.pill, isFocused && { backgroundColor: theme.accentSoft }]}>
        <ThemedText
          style={{ fontSize: 18, lineHeight: 22, color: isFocused ? theme.accent : theme.textSecondary }}>
          {emoji}
        </ThemedText>
      </View>
      <ThemedText type="caption" style={{ color: isFocused ? theme.accent : theme.textSecondary }}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.two,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  pill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
  },
});
