import type { AllergenId, GroupId } from '@/data/groups';
import type { Meal, MealSummary } from '@/lib/mealdb';

import { createPersistedStore } from './persisted';

export type ShoppingItem = {
  id: string;
  name: string;
  measure: string;
  recipeId: string;
  recipeName: string;
  checked: boolean;
};

type AppState = {
  favorites: MealSummary[];
  shopping: ShoppingItem[];
  profile: { groups: GroupId[]; allergens: AllergenId[] };
};

const store = createPersistedStore<AppState>('recipe-app/state/v1', {
  favorites: [],
  shopping: [],
  profile: { groups: [], allergens: [] },
});

export const useAppStore = store.useStore;

// ——— Favorites ———

export const useIsFavorite = (id: string) => useAppStore((s) => s.favorites.some((f) => f.id === id));

export function toggleFavorite(meal: MealSummary) {
  store.setState((s) => {
    const exists = s.favorites.some((f) => f.id === meal.id);
    const summary: MealSummary = {
      id: meal.id,
      name: meal.name,
      thumb: meal.thumb,
      category: meal.category,
      area: meal.area,
    };
    return {
      ...s,
      favorites: exists ? s.favorites.filter((f) => f.id !== meal.id) : [summary, ...s.favorites],
    };
  });
}

// ——— Shopping list ———

export function addRecipeToShopping(meal: Meal) {
  store.setState((s) => {
    const rest = s.shopping.filter((item) => item.recipeId !== meal.id);
    const items = meal.ingredients
      .map((ing, index) => ({
        id: `${meal.id}-${index}`,
        name: ing.name,
        measure: ing.measure,
        recipeId: meal.id,
        recipeName: meal.name,
        checked: false,
      }))
      // Nobody needs tap water on a shopping list.
      .filter((item) => !/^(cold |warm |hot |boiling )?water$/i.test(item.name.trim()));
    return { ...s, shopping: [...rest, ...items] };
  });
}

export const useIsInShopping = (recipeId: string) =>
  useAppStore((s) => s.shopping.some((i) => i.recipeId === recipeId));

export function toggleShoppingItem(id: string) {
  store.setState((s) => ({
    ...s,
    shopping: s.shopping.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
  }));
}

export function removeRecipeFromShopping(recipeId: string) {
  store.setState((s) => ({ ...s, shopping: s.shopping.filter((i) => i.recipeId !== recipeId) }));
}

export function clearCheckedShopping() {
  store.setState((s) => ({ ...s, shopping: s.shopping.filter((i) => !i.checked) }));
}

// ——— Health profile ———

export function toggleProfileGroup(group: GroupId) {
  store.setState((s) => {
    const groups = s.profile.groups.includes(group)
      ? s.profile.groups.filter((g) => g !== group)
      : [...s.profile.groups, group];
    return { ...s, profile: { ...s.profile, groups } };
  });
}

export function toggleProfileAllergen(allergen: AllergenId) {
  store.setState((s) => {
    const allergens = s.profile.allergens.includes(allergen)
      ? s.profile.allergens.filter((a) => a !== allergen)
      : [...s.profile.allergens, allergen];
    return { ...s, profile: { ...s.profile, allergens } };
  });
}
