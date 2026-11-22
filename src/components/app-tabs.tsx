import { NativeTabs } from 'expo-router/native-tabs';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.accentSoft}
      tintColor={colors.accent}
      labelStyle={{ selected: { color: colors.accent } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Discover</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'fork.knife', selected: 'fork.knife' }} md="restaurant" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="world">
        <NativeTabs.Trigger.Label>World</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="globe" md="public" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="kids">
        <NativeTabs.Trigger.Label>Kids</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="figure.and.child.holdinghands" md="child_care" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="kitchen">
        <NativeTabs.Trigger.Label>My kitchen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'heart', selected: 'heart.fill' }} md="kitchen" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
