/** People groups that health cautions can target, plus common food allergens. */

export type GroupId =
  | 'babies'
  | 'toddlers'
  | 'children'
  | 'pregnancy'
  | 'olderAdults'
  | 'diabetes'
  | 'kidney'
  | 'heart'
  | 'bloodThinners'
  | 'digestive';

export type CautionLevel = 'avoid' | 'limit' | 'care';

export type Group = {
  id: GroupId;
  label: string;
  short: string;
  emoji: string;
  description: string;
  /** Whether this group is one of the "kids" age bands. */
  isChild?: boolean;
};

export const GROUPS: Record<GroupId, Group> = {
  babies: {
    id: 'babies',
    label: 'Babies under 12 months',
    short: 'Babies',
    emoji: '👶',
    description: 'Immune and digestive systems are still developing; kidneys cannot handle much salt.',
    isChild: true,
  },
  toddlers: {
    id: 'toddlers',
    label: 'Toddlers & young kids (1–4)',
    short: 'Ages 1–4',
    emoji: '🧒',
    description: 'Highest choking risk; small stomachs need nutrient-dense food.',
    isChild: true,
  },
  children: {
    id: 'children',
    label: 'Children (5–14)',
    short: 'Ages 5–14',
    emoji: '🧑‍🎓',
    description: 'Fast growth — needs plenty of iron, calcium and protein; limit added sugar and salt.',
    isChild: true,
  },
  pregnancy: {
    id: 'pregnancy',
    label: 'Pregnancy & breastfeeding',
    short: 'Pregnancy',
    emoji: '🤰',
    description: 'Higher risk from listeria, toxoplasma, mercury and alcohol.',
  },
  olderAdults: {
    id: 'olderAdults',
    label: 'Older adults (65+)',
    short: 'Older adults',
    emoji: '🧓',
    description: 'Weaker immunity makes food poisoning more serious; chewing and swallowing may be harder.',
  },
  diabetes: {
    id: 'diabetes',
    label: 'Diabetes / blood sugar',
    short: 'Diabetes',
    emoji: '🩸',
    description: 'Foods high in sugar or refined starch can raise blood glucose quickly.',
  },
  kidney: {
    id: 'kidney',
    label: 'Kidney disease',
    short: 'Kidney',
    emoji: '🫘',
    description: 'May need to limit potassium, phosphorus, sodium or protein — follow your care team.',
  },
  heart: {
    id: 'heart',
    label: 'High blood pressure / heart',
    short: 'Heart & BP',
    emoji: '❤️',
    description: 'Salt and saturated fat are the main things to keep an eye on.',
  },
  bloodThinners: {
    id: 'bloodThinners',
    label: 'On blood thinners (e.g. warfarin)',
    short: 'Blood thinners',
    emoji: '💊',
    description: 'Vitamin K–rich foods should be eaten in steady amounts, not avoided.',
  },
  digestive: {
    id: 'digestive',
    label: 'Sensitive gut (IBS / reflux)',
    short: 'Sensitive gut',
    emoji: '🌀',
    description: 'Spicy, acidic, fatty or high-FODMAP foods can trigger symptoms.',
  },
};

export const GROUP_ORDER: GroupId[] = [
  'babies',
  'toddlers',
  'children',
  'pregnancy',
  'olderAdults',
  'diabetes',
  'kidney',
  'heart',
  'bloodThinners',
  'digestive',
];

export type AllergenId =
  | 'milk'
  | 'egg'
  | 'fish'
  | 'shellfish'
  | 'peanut'
  | 'treeNut'
  | 'gluten'
  | 'soy'
  | 'sesame'
  | 'celery'
  | 'mustard'
  | 'sulphites';

export const ALLERGENS: Record<AllergenId, { label: string; emoji: string }> = {
  milk: { label: 'Milk', emoji: '🥛' },
  egg: { label: 'Egg', emoji: '🥚' },
  fish: { label: 'Fish', emoji: '🐟' },
  shellfish: { label: 'Shellfish', emoji: '🦐' },
  peanut: { label: 'Peanut', emoji: '🥜' },
  treeNut: { label: 'Tree nuts', emoji: '🌰' },
  gluten: { label: 'Gluten', emoji: '🌾' },
  soy: { label: 'Soy', emoji: '🫛' },
  sesame: { label: 'Sesame', emoji: '⚪' },
  celery: { label: 'Celery', emoji: '🥬' },
  mustard: { label: 'Mustard', emoji: '🟡' },
  sulphites: { label: 'Sulphites', emoji: '🧪' },
};

export const ALLERGEN_ORDER = Object.keys(ALLERGENS) as AllergenId[];

export const LEVEL_LABEL: Record<CautionLevel, string> = {
  avoid: 'Avoid',
  limit: 'Limit',
  care: 'Take care',
};

export const LEVEL_RANK: Record<CautionLevel, number> = { avoid: 3, limit: 2, care: 1 };
