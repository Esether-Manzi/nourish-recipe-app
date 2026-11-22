/**
 * Thin client for TheMealDB (https://www.themealdb.com/api.php).
 * The free test key "1" is public and needs no sign-up.
 */

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export type MealSummary = {
  id: string;
  name: string;
  thumb: string;
  category?: string;
  area?: string;
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
};

export type Category = {
  id: string;
  name: string;
  thumb: string;
  description: string;
};

type RawMeal = Record<string, string | null | undefined>;

const cache = new Map<string, Promise<unknown>>();

async function get<T>(path: string, { useCache = true } = {}): Promise<T> {
  const url = `${BASE_URL}/${path}`;
  if (useCache && cache.has(url)) {
    return cache.get(url) as Promise<T>;
  }
  const request = fetch(url).then(async (res) => {
    if (!res.ok) {
      throw new Error(`TheMealDB request failed (${res.status})`);
    }
    return (await res.json()) as T;
  });
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
    area: clean(raw.strArea) || undefined,
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
    area: clean(raw.strArea),
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

export async function getMeal(id: string): Promise<Meal | null> {
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
  const res = await get<MealsResponse>(`search.php?s=${encodeURIComponent(query.trim())}`);
  return mealsOf(res).map(toMeal);
}

export async function filterByIngredient(ingredient: string): Promise<MealSummary[]> {
  const key = ingredient.trim().toLowerCase().replace(/\s+/g, '_');
  const res = await get<MealsResponse>(`filter.php?i=${encodeURIComponent(key)}`);
  return mealsOf(res).map(toSummary);
}

export async function filterByCategory(category: string): Promise<MealSummary[]> {
  const res = await get<MealsResponse>(`filter.php?c=${encodeURIComponent(category)}`);
  return mealsOf(res).map((raw) => ({ ...toSummary(raw), category }));
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
