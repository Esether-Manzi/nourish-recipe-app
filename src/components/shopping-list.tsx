import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, EmptyView } from '@/components/ui';
import { PressableLink } from '@/components/pressable-link';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  clearCheckedShopping,
  removeRecipeFromShopping,
  toggleShoppingItem,
  useAppStore,
  type ShoppingItem,
} from '@/store/app-store';

/** The shopping list, grouped by recipe. Rendered inside the My kitchen tab. */
export function ShoppingList() {
  const theme = useTheme();
  const items = useAppStore((s) => s.shopping);

  const groups = useMemo(() => {
    const map = new Map<string, { recipeId: string; recipeName: string; items: ShoppingItem[] }>();
    for (const item of items) {
      const group = map.get(item.recipeId) ?? {
        recipeId: item.recipeId,
        recipeName: item.recipeName,
        items: [],
      };
      group.items.push(item);
      map.set(item.recipeId, group);
    }
    return [...map.values()];
  }, [items]);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <>
      <View style={{ gap: Spacing.one }}>
        <ThemedText type="small" themeColor="textSecondary">
          {items.length
            ? `${items.length - checkedCount} of ${items.length} items left`
            : 'Add ingredients from any recipe.'}
        </ThemedText>
      </View>

      {items.length ? (
        <>
          {checkedCount ? (
            <Button
              label={`Clear ${checkedCount} checked item${checkedCount === 1 ? '' : 's'}`}
              variant="secondary"
              onPress={clearCheckedShopping}
            />
          ) : null}
          {groups.map((group) => (
            <Card key={group.recipeId}>
              <View style={styles.groupHeader}>
                <PressableLink
                  href={{ pathname: '/recipe/[id]', params: { id: group.recipeId } }}
                  style={{ flex: 1 }}>
                  <ThemedText type="subtitle" numberOfLines={2}>
                    {group.recipeName} ›
                  </ThemedText>
                </PressableLink>
                <Pressable
                  onPress={() => removeRecipeFromShopping(group.recipeId)}
                  accessibilityLabel={`Remove ${group.recipeName} from list`}
                  hitSlop={10}>
                  <ThemedText type="link" themeColor="textSecondary">
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
              {group.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => toggleShoppingItem(item.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.checked }}
                  style={styles.item}>
                  <View
                    style={[
                      styles.box,
                      {
                        borderColor: item.checked ? theme.success : theme.textSecondary,
                        backgroundColor: item.checked ? theme.success : 'transparent',
                      },
                    ]}>
                    {item.checked ? (
                      <ThemedText type="caption" style={{ color: theme.background, fontWeight: 800 }}>
                        ✓
                      </ThemedText>
                    ) : null}
                  </View>
                  <ThemedText
                    type="small"
                    style={[
                      { flex: 1 },
                      item.checked && { textDecorationLine: 'line-through', opacity: 0.5 },
                    ]}>
                    {item.name}
                  </ThemedText>
                  <ThemedText
                    type="caption"
                    themeColor="textSecondary"
                    style={item.checked && { opacity: 0.5 }}>
                    {item.measure}
                  </ThemedText>
                </Pressable>
              ))}
            </Card>
          ))}
        </>
      ) : (
        <EmptyView
          emoji="🛒"
          title="Your list is empty"
          message="Open a recipe and tap “Add to list” to collect its ingredients here."
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: Radius.small - 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
