# Nourish 🥕

A cross-platform recipe app that does more than list ingredients. For every dish it explains the
**health benefits for kids and adults**, possible **side effects**, **allergens**, and **who should take
care**: babies, toddlers, children, pregnancy, older adults, and people with diabetes, kidney disease,
high blood pressure, blood-thinner medication or a sensitive gut. It also has a **7-day healthy kids'
meal plan** for children under 15.

Built with **Expo SDK 58, React Native, Expo Router and TypeScript**. Recipes come from
[TheMealDB](https://www.themealdb.com/).

## Features

| | |
| --- | --- |
| 🍽️ **Discover** | A random featured recipe, categories, and a grid of recipe cards |
| 🔎 **Search** | By dish name or by ingredient ("what's in my fridge?"), with debounced live results |
| ❤️ **Health insights** | Each recipe is checked against a curated ingredient health guide (~75 entries, covering about 90% of TheMealDB's ingredients) |
| 🧒 **Kids' kitchen** | Age-band guidance (1–3, 4–8, 9–14), a 7-day meal plan of real recipes with kid-friendly tweaks, "superfoods", and golden rules |
| 🩺 **Health profile** | Pick the people you cook for and any allergies; recipes then show personal warnings |
| ♥ **Favourites** | Saved on the device, so they still work offline |
| 🛒 **Shopping list** | Add a recipe's ingredients, tick them off, and clear what's done |
| 👩‍🍳 **Cooking mode** | Full-screen steps, the screen stays awake, and timers are detected automatically from the text ("bake 35 minutes") |
| 🌗 **Light & dark mode** | Warm, food-inspired theme in both modes |

## How the health engine works

1. `src/data/ingredients.ts` holds the curated guide. Each entry lists the nutrients, the benefits
   for kids and for adults, side effects, allergens, and cautions by group (`avoid`, `limit` or
   `take care`).
2. `src/lib/health.ts` matches each recipe ingredient to the guide entry with the **longest
   whole-word keyword**, so "coconut milk" isn't counted as dairy and "eggplant" isn't counted as egg.
3. It then combines everything into a report: a kids verdict (🌟 great / 🛠️ small tweaks /
   ⚠️ needs changes) with practical tips, nutrients, benefits, allergens, and warnings by group.

> The health content is general information summarised from public guidance (WHO, NHS, CDC, FDA,
> AAP). It is **not medical advice**, and the app says so on every health screen.

## Project structure

```
src/
  app/                 # Expo Router screens
    (tabs)/            # Discover, Search, Kids, Saved, Shopping
    recipe/[id].tsx    # Recipe detail: ingredients, method, health
    cook/[id].tsx      # Cooking mode
    ingredient/[id].tsx# Ingredient health guide
    profile.tsx        # Household health profile
  components/          # UI building blocks, health panel, cards, tabs
  data/                # Ingredient guide, groups & allergens, kids' plan
  lib/                 # TheMealDB client, health engine, timers, storage
  store/               # Tiny persisted store (useSyncExternalStore + SQLite kv-store)
```

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android or iOS), or press `w` to open it in a browser.

```bash
npx expo lint      # lint
npx tsc --noEmit   # typecheck
```

## Tech notes

- **Expo Router** native tabs on iOS and Android, a custom bottom tab bar on web
- **expo-sqlite/kv-store** for synchronous on-device storage (localStorage on web)
- **expo-image** for cached, smoothly loading photos
- **expo-keep-awake** keeps the screen on in cooking mode
- No backend, no API keys: TheMealDB's free public endpoint
