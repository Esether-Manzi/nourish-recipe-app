import type { Meal } from '@/lib/mealdb';

/** A built-in recipe as written in the data files; `makeRecipe` turns it into a `Meal`. */
export type LocalRecipe = Omit<Meal, 'steps' | 'instructions' | 'thumb'> & {
  emoji: string;
  about: string;
  stepsList: string[];
};

export const makeRecipe = (r: LocalRecipe): Meal => ({
  ...r,
  thumb: '',
  steps: r.stepsList,
  instructions: r.stepsList.join('\n'),
  local: true,
});
