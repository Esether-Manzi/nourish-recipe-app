/**
 * Food-safety tips for travellers, summarised from WHO and CDC travellers' health advice.
 * General information only.
 */

export const TRAVEL_FOOD_TIPS = [
  {
    emoji: '🔥',
    title: 'Hot and freshly cooked',
    text: 'Choose food that is cooked in front of you and served steaming hot. Busy stalls with high turnover are usually a good sign.',
  },
  {
    emoji: '💧',
    title: 'Safe water',
    text: 'Where tap water isn’t treated, drink sealed bottled, boiled or filtered water. Ice is only safe if it was made from safe water.',
  },
  {
    emoji: '🍌',
    title: 'Peel it',
    text: 'Fruit you peel yourself (bananas, oranges, mangoes) is safest. Raw salads washed in tap water are riskier.',
  },
  {
    emoji: '🥛',
    title: 'Pasteurised dairy',
    text: 'Avoid unpasteurised milk and fresh cheese unless you know it’s been boiled or pasteurised.',
  },
  {
    emoji: '🧼',
    title: 'Clean hands',
    text: 'Wash your hands or use sanitiser before eating, especially when eating with your hands, which is the norm in many places.',
  },
  {
    emoji: '🗣️',
    title: 'Allergies',
    text: 'Learn the local words for your allergens, or carry a translated card. Peanuts (groundnuts) are a common sauce base in East and West Africa.',
  },
];

/** A few welcoming notes for countries with built-in local collections. */
export const COUNTRY_NOTES: Record<string, { tryThis: string; etiquette?: string }> = {
  NG: {
    tryThis: 'Puff-puff and chin chin from street vendors, meat pie from a bakery, and crunchy kuli kuli.',
  },
  GH: { tryThis: 'Plantain chips sold in bags at traffic lights and markets.' },
  CM: { tryThis: 'Warm accra banana (banana fritters), often eaten with beans and pepper sauce.' },
  ZA: { tryThis: 'Koeksisters, the syrupy plaited doughnuts sold at bakeries and markets.' },
  KR: { tryThis: 'Yakgwa, the honey cookies served at holidays and with tea.' },
  UG: {
    tryThis:
      'A Rolex from a roadside stall, matooke with groundnut sauce, and chicken luwombo at a celebration.',
    etiquette:
      'Meals are often shared from a common dish. Wash your hands before eating, and eat with your right hand.',
  },
};
