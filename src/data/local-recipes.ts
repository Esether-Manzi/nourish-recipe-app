/**
 * All built-in recipes: dishes TheMealDB doesn't have, written for this app. Each collection
 * lives in its own file under ./recipes.
 */

import type { Meal } from '@/lib/mealdb';

import { AFRICAN_SNACK_RECIPES } from './recipes/african-snacks';
import { DESSERT_RECIPES } from './recipes/desserts';
import { PIZZA_RECIPES } from './recipes/pizza';
import { UGANDA_RECIPES } from './recipes/uganda';

export { AFRICAN_SNACK_RECIPES, DESSERT_RECIPES, PIZZA_RECIPES, UGANDA_RECIPES };

export const LOCAL_RECIPES: Meal[] = [
  ...UGANDA_RECIPES,
  ...AFRICAN_SNACK_RECIPES,
  ...PIZZA_RECIPES,
  ...DESSERT_RECIPES,
];

const LOCAL_BY_ID = new Map(LOCAL_RECIPES.map((r) => [r.id, r]));

export const getLocalRecipe = (id: string) => LOCAL_BY_ID.get(id) ?? null;

/** Categories used by built-in recipes that TheMealDB doesn't have (shown as extra Discover chips). */
export const LOCAL_ONLY_CATEGORIES = ['Pizza', 'Snack'];
