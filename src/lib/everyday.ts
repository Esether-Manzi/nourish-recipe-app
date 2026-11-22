/**
 * "Can I make this?" — rates how practical a recipe is for an ordinary, low-cost household:
 * how many ingredients are easy to find, what to swap, and whether it needs an oven.
 */

import { AVAILABILITY, type Availability, type Tier } from '@/data/availability';
import { isNeutralIngredient } from '@/lib/health';
import { createKeywordMatcher } from '@/lib/keyword-match';
import type { Meal, RecipeIngredient } from '@/lib/mealdb';

const matchAvailability = createKeywordMatcher(AVAILABILITY, (a) => a.match);

export function findAvailability(name: string): Availability | null {
  return matchAvailability(name);
}

export type EverydayLevel = 'everyday' | 'mostly' | 'special';

export type EverydayReport = {
  level: EverydayLevel;
  /** Ingredients that count (water, salt-and-pepper style items are ignored). */
  total: number;
  easy: number;
  hard: { ingredient: RecipeIngredient; swap?: string; unknown?: boolean }[];
  needsOven: boolean;
};

// "baking sheet" or "baked beans" alone don't mean an oven is needed.
const OVEN = /\b(oven|bake|baked(?! beans)|roast(?:ing)? in|grill(?:ed)? under|broil|preheat|gas mark)\b/i;

export function analyzeEveryday(meal: Pick<Meal, 'ingredients' | 'instructions'>): EverydayReport {
  let total = 0;
  let easy = 0;
  const hard: EverydayReport['hard'] = [];

  for (const ingredient of meal.ingredients) {
    const found = findAvailability(ingredient.name);
    if (!found && isNeutralIngredient(ingredient.name)) continue;
    total++;
    const tier: Tier | 'unknown' = found?.tier ?? 'unknown';
    if (tier === 'staple' || tier === 'common') {
      easy++;
    } else {
      hard.push({ ingredient, swap: found?.swap, unknown: tier === 'unknown' });
    }
  }

  const share = total ? easy / total : 1;
  const specialty = hard.filter((h) => !h.unknown).length;
  const level: EverydayLevel =
    specialty === 0 && share >= 0.85 ? 'everyday' : specialty <= 2 && share >= 0.65 ? 'mostly' : 'special';

  return { level, total, easy, hard, needsOven: OVEN.test(meal.instructions) };
}

export const EVERYDAY_LABEL: Record<EverydayLevel, { label: string; emoji: string; short: string }> = {
  everyday: { label: 'Everyday ingredients', emoji: '🧺', short: 'Everyday' },
  mostly: { label: 'A few swaps needed', emoji: '🔁', short: 'Easy swaps' },
  special: { label: 'Special-occasion ingredients', emoji: '✨', short: 'Special' },
};

export const NO_OVEN_TIP =
  'No oven? Cook it in a heavy covered pan or sufuria over low charcoal or a low flame. Put a few hot coals on the lid for top heat, and turn or stir now and then. It usually takes a little longer.';
