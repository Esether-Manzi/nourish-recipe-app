/**
 * Kids' menu: a 7-day healthy meal plan built from real TheMealDB recipes, plus age-band guidance.
 * Guidance is summarised from WHO, NHS and AAP recommendations for children; it is general
 * information, not individual dietary advice.
 */

export type AgeBandId = '1-3' | '4-8' | '9-14';

export type AgeBand = {
  id: AgeBandId;
  label: string;
  emoji: string;
  portion: string;
  focus: string[];
  daily: { label: string; value: string }[];
  watchOut: string[];
};

export const AGE_BANDS: AgeBand[] = [
  {
    id: '1-3',
    label: 'Ages 1–3',
    emoji: '🧸',
    portion:
      'About a quarter of an adult portion. Little tummies fill fast, so offer 3 meals and 2–3 small snacks.',
    focus: [
      'Iron (meat, eggs, beans, fortified cereal)',
      'Full-fat dairy until age 2',
      'Soft textures, cut small',
    ],
    daily: [
      { label: 'Milk / dairy', value: '~350 ml milk or 3 servings' },
      { label: 'Salt', value: 'Under 2 g a day' },
      { label: 'Added sugar', value: 'None under 2' },
    ],
    watchOut: [
      'Choking: quarter grapes and cherry tomatoes, no whole nuts, no popcorn or hard sweets',
      'No honey before 12 months; no rice drinks under 5',
      'Avoid salty sauces and stock cubes in their portion',
    ],
  },
  {
    id: '4-8',
    label: 'Ages 4–8',
    emoji: '🎒',
    portion:
      'About half to three-quarters of an adult portion. Use the child’s hand as a guide: a palm of protein, a fist of carbs.',
    focus: [
      'Calcium for growing bones',
      'Fibre from wholegrains, fruit and veg',
      'Water and milk as main drinks',
    ],
    daily: [
      { label: 'Fruit & veg', value: '5 small handfuls' },
      { label: 'Salt', value: 'Under 3 g (age 4–6), 5 g (7–10)' },
      { label: 'Added sugar', value: 'Under ~19–24 g (5–6 tsp)' },
    ],
    watchOut: [
      'Whole nuts are still a choking risk under 5',
      'Sugary drinks and juice — keep juice to one small glass with a meal',
      'Very spicy food can be served on the side',
    ],
  },
  {
    id: '9-14',
    label: 'Ages 9–14',
    emoji: '⚽',
    portion: 'Close to an adult portion, more on active days. Growth spurts mean bigger appetites.',
    focus: [
      'Iron (especially girls after periods start)',
      'Calcium and vitamin D during peak bone growth',
      'Protein for sport and growth',
    ],
    daily: [
      { label: 'Fruit & veg', value: '5+ portions (80 g each)' },
      { label: 'Salt', value: 'Under 6 g (age 11+)' },
      { label: 'Added sugar', value: 'Under ~25–30 g (6–7 tsp)' },
    ],
    watchOut: [
      'Energy drinks and coffee — caffeine is not recommended for children',
      'Skipping breakfast — linked to poorer concentration',
      'Ultra-processed snacks crowding out real meals',
    ],
  },
];

export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner';

export type PlanMeal = {
  slot: MealSlot;
  mealId: string;
  name: string;
  why: string;
  kidTip?: string;
};

export type PlanDay = {
  day: string;
  short: string;
  meals: PlanMeal[];
  snack: string;
};

export const KIDS_MEAL_PLAN: PlanDay[] = [
  {
    day: 'Monday',
    short: 'Mon',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '53331',
        name: 'Oatmeal pancakes',
        why: 'Oats give slow-release energy; strawberries add vitamin C.',
        kidTip: 'Skip the syrup — top with mashed banana or yogurt instead.',
      },
      {
        slot: 'Lunch',
        mealId: '53486',
        name: 'Easy White Bean Soup',
        why: 'Beans pack protein, iron and fibre.',
        kidTip: 'Blend until smooth for toddlers.',
      },
      {
        slot: 'Dinner',
        mealId: '53367',
        name: 'Chicken Fried Rice',
        why: 'Lean protein with peas, carrots and egg in one bowl.',
        kidTip: 'Use low-salt soy sauce, and only a splash.',
      },
    ],
    snack: 'Apple slices with a thin spread of smooth peanut butter',
  },
  {
    day: 'Tuesday',
    short: 'Tue',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '53076',
        name: 'Bread omelette',
        why: 'Eggs are rich in choline for brain development.',
        kidTip: 'Use wholemeal bread and a pinch of salt only.',
      },
      {
        slot: 'Lunch',
        mealId: '53576',
        name: 'Carrot and Bean Fritters',
        why: 'Hidden veg and plant protein in finger-food form.',
        kidTip: 'Shallow-fry in a little oil or bake.',
      },
      {
        slot: 'Dinner',
        mealId: '52802',
        name: 'Fish pie',
        why: 'White fish provides iodine; milk adds calcium.',
        kidTip: 'Check carefully for bones. Leave out prawns if there is a shellfish allergy.',
      },
    ],
    snack: 'Plain yogurt with berries',
  },
  {
    day: 'Wednesday',
    short: 'Wed',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '53363',
        name: 'Jamaican Cornmeal Porridge',
        why: 'Warm, filling and gluten-free.',
        kidTip: 'Use much less condensed milk, or swap in milk and a little mashed banana.',
      },
      {
        slot: 'Lunch',
        mealId: '52872',
        name: 'Spanish Tortilla',
        why: 'Eggs and potato: protein plus energy that’s easy to pack for school.',
      },
      {
        slot: 'Dinner',
        mealId: '53113',
        name: 'Sukuma Wiki',
        why: 'Kale is full of calcium, vitamin K and vitamin C.',
        kidTip: 'Serve with ugali or rice and a portion of beans or egg for protein.',
      },
    ],
    snack: 'Banana and a glass of milk',
  },
  {
    day: 'Thursday',
    short: 'Thu',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '53372',
        name: 'Chinese Tomato Egg Stir Fry',
        why: 'Tomato vitamin C helps absorb the iron from egg.',
        kidTip: 'Skip the bouillon powder for under-5s.',
      },
      {
        slot: 'Lunch',
        mealId: '53532',
        name: 'Creamy Corn Soup',
        why: 'Sweetcorn is a fibre-rich veg most kids enjoy.',
        kidTip: 'Use a low-salt stock cube and less cream.',
      },
      {
        slot: 'Dinner',
        mealId: '52849',
        name: 'Spinach & Ricotta Cannelloni',
        why: 'Calcium-rich cheese and iron-rich spinach.',
        kidTip: 'Use pasteurised ricotta and mascarpone.',
      },
    ],
    snack: 'Cucumber and carrot sticks with hummus',
  },
  {
    day: 'Friday',
    short: 'Fri',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '53379',
        name: 'Dutch poffertjes (mini pancakes)',
        why: 'A fun end-of-week treat with buckwheat for extra fibre.',
        kidTip: 'Skip the icing sugar and serve with fruit.',
      },
      {
        slot: 'Lunch',
        mealId: '52850',
        name: 'Chicken Couscous',
        why: 'Lean chicken, chickpeas and apricots for protein, fibre and iron.',
        kidTip: 'Use a pinch of harissa or leave it out for a milder taste.',
      },
      {
        slot: 'Dinner',
        mealId: '53020',
        name: 'Rosol (Polish Chicken Soup)',
        why: 'Gentle and hydrating with lots of root veg.',
        kidTip: 'Remove whole cloves and bay leaves before serving.',
      },
    ],
    snack: 'Orange segments and a small handful of seeds (ground for under-5s)',
  },
  {
    day: 'Saturday',
    short: 'Sat',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '52963',
        name: 'Shakshuka',
        why: 'Eggs poached in tomato: protein plus vitamin C.',
        kidTip: 'Leave out the red chilli and quarter the cherry tomatoes.',
      },
      {
        slot: 'Lunch',
        mealId: '53067',
        name: 'Stuffed Bell Peppers with Quinoa and Black Beans',
        why: 'Quinoa is a complete protein; peppers are full of vitamin C.',
        kidTip: 'Use mild paprika instead of chilli powder.',
      },
      {
        slot: 'Dinner',
        mealId: '52908',
        name: 'Ratatouille',
        why: 'Five vegetables in one colourful dish.',
        kidTip: 'Serve with pasta or bread and some cheese for protein.',
      },
    ],
    snack: 'Popcorn for over-5s, or rice cakes for younger kids',
  },
  {
    day: 'Sunday',
    short: 'Sun',
    meals: [
      {
        slot: 'Breakfast',
        mealId: '52965',
        name: 'Breakfast Potatoes',
        why: 'A hearty weekend brunch.',
        kidTip: 'Swap the bacon for scrambled eggs and skip the maple syrup.',
      },
      {
        slot: 'Lunch',
        mealId: '52955',
        name: 'Egg Drop Soup',
        why: 'Light, quick and protein-rich.',
        kidTip: 'Use low-salt stock.',
      },
      {
        slot: 'Dinner',
        mealId: '52959',
        name: 'Baked salmon with fennel & tomatoes',
        why: 'Oily fish provides DHA omega-3 for brain and eye development.',
        kidTip: 'Remove all bones and pit or chop the olives.',
      },
    ],
    snack: 'Mango or melon cubes',
  },
];

export const KIDS_GOLDEN_RULES = [
  {
    emoji: '🌈',
    title: 'Eat the rainbow',
    text: 'Different coloured fruit and veg bring different vitamins.',
  },
  {
    emoji: '💧',
    title: 'Water first',
    text: 'Water and milk are the best drinks; keep juice to one small glass a day.',
  },
  { emoji: '🧂', title: 'Go easy on salt', text: 'Flavour with herbs, lemon and spices instead.' },
  {
    emoji: '🍽️',
    title: 'Eat together',
    text: 'Kids copy adults — sharing meals helps fussy eaters try new food.',
  },
  { emoji: '🔁', title: 'Keep offering', text: 'It can take 10–15 tries before a child accepts a new food.' },
];
