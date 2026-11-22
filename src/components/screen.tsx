import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Scrollable screen body. On iOS the system adjusts insets for the status bar and native tab bar;
 * elsewhere we pad manually. `inTabs` adds room for the tab bar.
 */
export function Screen({
  children,
  inTabs = true,
  hasHeader = false,
  ...rest
}: ScrollViewProps & { children: ReactNode; inTabs?: boolean; hasHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const ios = Platform.OS === 'ios';

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: theme.background }}
      {...rest}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: ios || hasHeader ? Spacing.three : insets.top + Spacing.three,
          paddingBottom: (inTabs && !ios ? BottomTabInset : 0) + insets.bottom + Spacing.five,
        },
        rest.contentContainerStyle,
      ]}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    flexGrow: 1,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.four,
    flexGrow: 1,
  },
});
