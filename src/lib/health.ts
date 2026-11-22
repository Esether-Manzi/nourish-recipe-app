/**
 * Turns a recipe's ingredient list into a health report using the offline ingredient guide.
 */

import {
  ALLERGEN_ORDER,
  GROUP_ORDER,
  GROUPS,
  LEVEL_RANK,
  type AllergenId,
  type CautionLevel,
  type GroupId,
} from '@/data/groups';
import { INGREDIENTS, type IngredientInfo } from '@/data/ingredients';
import { createKeywordMatcher, normalizeIngredient } from '@/lib/keyword-match';
import type { RecipeIngredient } from '@/lib/mealdb';

/** Ingredients with no meaningful health impact in recipe amounts; skipped rather than "unknown". */
const NEUTRAL =
  /^(pepper|salt and pepper|seasoning|starch|ice cubes?|soda water)$|water$|baking powder|bicarbonate|baking soda|yeast|vanilla|gelatin|food colou?ring|extract|essence|rose water|orange blossom water/;

export const isNeutralIngredient = (name: string) => NEUTRAL.test(normalizeIngredient(name));

const matchInfo = createKeywordMatcher(INGREDIENTS, (info) => info.match);

export function findIngredientInfo(name: string): IngredientInfo | null {
  return matchInfo(name);
}

export type GroupWarning = {
  group: GroupId;
  level: CautionLevel;
  reasons: { ingredient: string; infoId: string; level: CautionLevel; note: string }[];
};

export type KidsVerdict = 'great' | 'adapt' | 'caution';

export type HealthReport = {
  matched: { ingredient: RecipeIngredient; info: IngredientInfo }[];
  unmatched: RecipeIngredient[];
  nutrients: string[];
  kidBenefits: { text: string; ingredient: string }[];
  adultBenefits: { text: string; ingredient: string }[];
  sideEffects: { text: string; ingredient: string }[];
  allergens: { id: AllergenId; ingredients: string[] }[];
  warnings: GroupWarning[];
  kids: { verdict: KidsVerdict; headline: string; tips: string[] };
};

export function analyzeRecipe(ingredients: RecipeIngredient[]): HealthReport {
  const matched: HealthReport['matched'] = [];
  const unmatched: RecipeIngredient[] = [];
  const seen = new Set<string>();

  for (const ingredient of ingredients) {
    const info = findIngredientInfo(ingredient.name);
    if (!info) {
      if (isNeutralIngredient(ingredient.name)) continue;
      unmatched.push(ingredient);
      continue;
    }
    matched.push({ ingredient, info });
  }

  // De-duplicate by guide entry so "olive oil" twice doesn't repeat every fact.
  const unique = matched.filter(({ info }) => (seen.has(info.id) ? false : (seen.add(info.id), true)));

  const nutrients = [...new Set(unique.flatMap(({ info }) => info.nutrients))].filter(
    (n) => !/^(sodium|sugar|saturated fat|fat)$/i.test(n),
  );

  const kidBenefits = unique.flatMap(({ info }) =>
    info.benefits.kids.map((text) => ({ text, ingredient: info.name })),
  );
  const adultBenefits = unique.flatMap(({ info }) =>
    info.benefits.adults.map((text) => ({ text, ingredient: info.name })),
  );
  const sideEffects = unique.flatMap(({ info }) =>
    info.sideEffects.map((text) => ({ text, ingredient: info.name })),
  );

  const allergenMap = new Map<AllergenId, string[]>();
  for (const { info } of unique) {
    for (const allergen of info.allergens ?? []) {
      allergenMap.set(allergen, [...(allergenMap.get(allergen) ?? []), info.name]);
    }
  }
  const allergens = ALLERGEN_ORDER.filter((id) => allergenMap.has(id)).map((id) => ({
    id,
    ingredients: allergenMap.get(id)!,
  }));

  const warningMap = new Map<GroupId, GroupWarning>();
  for (const { info } of unique) {
    for (const caution of info.cautions ?? []) {
      const existing = warningMap.get(caution.group) ?? {
        group: caution.group,
        level: caution.level,
        reasons: [],
      };
      if (LEVEL_RANK[caution.level] > LEVEL_RANK[existing.level]) existing.level = caution.level;
      existing.reasons.push({
        ingredient: info.name,
        infoId: info.id,
        level: caution.level,
        note: caution.note,
      });
      warningMap.set(caution.group, existing);
    }
  }
  const warnings = GROUP_ORDER.filter((g) => warningMap.has(g)).map((g) => {
    const w = warningMap.get(g)!;
    w.reasons.sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
    return w;
  });

  return {
    matched,
    unmatched,
    nutrients,
    kidBenefits,
    adultBenefits,
    sideEffects,
    allergens,
    warnings,
    kids: kidsVerdict(warnings, kidBenefits.length),
  };
}

function kidsVerdict(warnings: GroupWarning[], benefitCount: number): HealthReport['kids'] {
  const childWarnings = warnings.filter((w) => GROUPS[w.group].isChild && w.group !== 'babies');
  const hasAvoid = childWarnings.some((w) => w.level === 'avoid');
  const hasLimit = childWarnings.some((w) => w.level === 'limit');
  // One tip per ingredient (the most serious, since reasons are sorted by level within each group).
  const tipByIngredient = new Map<string, string>();
  for (const r of childWarnings.flatMap((w) => w.reasons)) {
    const relevant = r.level !== 'care' || /chok|quarter|grate|bone|cut|chop/i.test(r.note);
    if (relevant && !tipByIngredient.has(r.ingredient))
      tipByIngredient.set(r.ingredient, `${r.ingredient}: ${r.note}`);
  }
  const tips = [...tipByIngredient.values()].slice(0, 5);

  if (hasAvoid) {
    return {
      verdict: 'caution',
      headline: 'Needs changes before serving to kids',
      tips,
    };
  }
  if (hasLimit) {
    return { verdict: 'adapt', headline: 'Kid-friendly with a few tweaks', tips };
  }
  return {
    verdict: 'great',
    headline: benefitCount >= 3 ? 'A great choice for kids' : 'Fine for kids',
    tips,
  };
}

export function hasProfileConflicts(report: HealthReport, groups: GroupId[], allergens: AllergenId[]) {
  return {
    groups: report.warnings.filter((w) => groups.includes(w.group) && w.level !== 'care'),
    allergens: report.allergens.filter((a) => allergens.includes(a.id)),
  };
}
