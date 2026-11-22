/**
 * Thin client for TheMealDB (https://www.themealdb.com/api.php), merged with the app's built-in
 * local recipes. The free test key "1" is public and needs no sign-up.
 */

import { getLocalRecipe, LOCAL_RECIPES } from '@/data/local-recipes';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export type MealSummary = {
  id: string;
  name: string;
  thumb: string;
  category?: string;
  area?: string;
  /** Built-in recipes have no photo; they show this emoji instead. */
  emoji?: string;
  local?: boolean;
};

export type RecipeIngredient = {
  name: string;
  measure: string;
};

export type Meal = MealSummary & {
  category: string;
  area: string;
  instructions: string;
  steps: string[];
  tags: string[];
  youtube?: string;
  source?: string;
  ingredients: RecipeIngredient[];
  /** Short introduction (built-in recipes). */
  about?: string;
};

export type Category = {
  id: string;
  name: string;
  thumb: string;
  description: string;
};

type RawMeal = Record<string, string | null | undefined>;

const cache = new Map<string, Promise<unknown>>();

// TheMealDB's free key rate-limits bursts (HTTP 429), so requests go through a small queue and
// are retried with a back-off when throttled.
const MAX_CONCURRENT = 3;
let active = 0;
const waiting: (() => void)[] = [];

async function throttled<T>(task: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENT) await new Promise<void>((resolve) => waiting.push(resolve));
  active++;
  try {
    return await task();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson<T>(url: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const res = await throttled(() => fetch(url));
    if (res.status === 429 && attempt < 3) {
      await sleep(1000 * 2 ** attempt);
      continue;
    }
    if (!res.ok) {
      throw new Error(
        res.status === 429
          ? 'Too many requests — please wait a moment and try again.'
          : `TheMealDB request failed (${res.status})`,
      );
    }
    return (await res.json()) as T;
  }
}

async function get<T>(path: string, { useCache = true } = {}): Promise<T> {
  const url = `${BASE_URL}/${path}`;
  if (useCache && cache.has(url)) {
    return cache.get(url) as Promise<T>;
  }
  const request = fetchJson<T>(url);
  if (useCache) {
    cache.set(url, request);
    // Don't keep failed requests around, so a retry can succeed.
    request.catch(() => cache.delete(url));
  }
  return request;
}

const clean = (value: string | null | undefined) => (value ?? '').trim();

/** Splits TheMealDB's free-text instructions into readable steps. */
export function splitSteps(instructions: string): string[] {
  return instructions
    .split(/\r?\n+/)
    .map((line) =>
      line
        // Drop "STEP 1", "1.", "1)" style prefixes; the UI numbers steps itself.
        .replace(/^\s*(step\s*\d+[:.)-]?|\d+\s*[.):-])\s*/i, '')
        .trim(),
    )
    .filter((line) => line.length > 0 && !/^step\s*\d*$/i.test(line) && !/^\d+$/.test(line));
}

function toSummary(raw: RawMeal): MealSummary {
  return {
    id: clean(raw.idMeal),
    name: clean(raw.strMeal),
    thumb: clean(raw.strMealThumb),
    category: clean(raw.strCategory) || undefined,
    // Newer recipes store the country (e.g. "Cambodia") instead of the area ("Cambodian").
    area: clean(raw.strArea) || clean(raw.strCountry) || undefined,
  };
}

function toMeal(raw: RawMeal): Meal {
  const ingredients: RecipeIngredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = clean(raw[`strIngredient${i}`]);
    if (name) {
      ingredients.push({ name, measure: clean(raw[`strMeasure${i}`]) });
    }
  }
  const instructions = clean(raw.strInstructions);
  return {
    ...toSummary(raw),
    category: clean(raw.strCategory),
    area: clean(raw.strArea) || clean(raw.strCountry),
    instructions,
    steps: splitSteps(instructions),
    tags: clean(raw.strTags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    youtube: clean(raw.strYoutube) || undefined,
    source: clean(raw.strSource) || undefined,
    ingredients,
  };
}

type MealsResponse = { meals: RawMeal[] | null | string };

const mealsOf = (res: MealsResponse) => (Array.isArray(res.meals) ? res.meals : []);

export const toSummaryOf = (meal: Meal): MealSummary => ({
  id: meal.id,
  name: meal.name,
  thumb: meal.thumb,
  category: meal.category,
  area: meal.area,
  emoji: meal.emoji,
  local: meal.local,
});

const contains = (text: string, query: string) => text.toLowerCase().includes(query.trim().toLowerCase());

export async function getMeal(id: string): Promise<Meal | null> {
  const local = getLocalRecipe(id);
  if (local) return local;
  const res = await get<MealsResponse>(`lookup.php?i=${encodeURIComponent(id)}`);
  const raw = mealsOf(res)[0];
  return raw ? toMeal(raw) : null;
}

export async function getRandomMeal(): Promise<Meal | null> {
  const res = await get<MealsResponse>('random.php', { useCache: false });
  const raw = mealsOf(res)[0];
  return raw ? toMeal(raw) : null;
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const local = LOCAL_RECIPES.filter(
    (r) => contains(r.name, query) || contains(r.area, query) || r.tags.some((t) => contains(t, query)),
  );
  const res = await get<MealsResponse>(`search.php?s=${encodeURIComponent(query.trim())}`);
  return [...local, ...mealsOf(res).map(toMeal)];
}

export async function filterByIngredient(ingredient: string): Promise<MealSummary[]> {
  const key = ingredient.trim().toLowerCase().replace(/\s+/g, '_');
  const local = LOCAL_RECIPES.filter((r) => r.ingredients.some((i) => contains(i.name, ingredient))).map(
    toSummaryOf,
  );
  const res = await get<MealsResponse>(`filter.php?i=${encodeURIComponent(key)}`);
  return [...local, ...mealsOf(res).map(toSummary)];
}

export async function filterByCategory(category: string): Promise<MealSummary[]> {
  const local = LOCAL_RECIPES.filter((r) => r.category === category).map(toSummaryOf);
  const res = await get<MealsResponse>(`filter.php?c=${encodeURIComponent(category)}`);
  return [...local, ...mealsOf(res).map((raw) => ({ ...toSummary(raw), category }))];
}

/** Recipes from one country. `query` is the name TheMealDB files them under (usually the country). */
export async function filterByCountry(query: string, localArea?: string): Promise<MealSummary[]> {
  const local = localArea ? LOCAL_RECIPES.filter((r) => r.area === localArea).map(toSummaryOf) : [];
  if (!query) return local;
  const res = await get<MealsResponse>(`filter.php?a=${encodeURIComponent(query)}`);
  return [...local, ...mealsOf(res).map(toSummary)];
}

export async function getCategories(): Promise<Category[]> {
  const res = await get<{ categories: Record<string, string>[] | null }>('categories.php');
  return (res.categories ?? []).map((c) => ({
    id: c.idCategory,
    name: c.strCategory,
    thumb: c.strCategoryThumb,
    description: c.strCategoryDescription,
  }));
}

export function ingredientImage(name: string) {
  return `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}-small.png`;
}
