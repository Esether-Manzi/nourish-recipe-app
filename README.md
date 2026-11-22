# Nourish 🥕

A cross-platform recipe app that does more than list ingredients. For every dish it explains the
**health benefits for kids and adults**, possible **side effects**, **allergens**, and **who should take
care**: babies, toddlers, children, pregnancy, older adults, and people with diabetes, kidney disease,
high blood pressure, blood-thinner medication or a sensitive gut. It also has a **7-day healthy kids'
meal plan** for children under 15.

It's built for **ordinary households, not just professional kitchens**. Every recipe says whether you
can make it with everyday market ingredients and suggests low-cost swaps for the rest. A built-in
**home-style Ugandan collection** covers dishes TheMealDB doesn't have, and a **World kitchen** helps
travellers explore food from 68 countries.

Built with **Expo SDK 58, React Native, Expo Router and TypeScript**. Recipes come from
[TheMealDB](https://www.themealdb.com/).

## Features

| | |
| --- | --- |
| 🍽️ **Discover** | A random featured recipe, categories, and a grid of recipe cards |
| 🔎 **Search** | By dish name or by ingredient ("what's in my fridge?"), with debounced live results |
| ❤️ **Health insights** | Each recipe is checked against a curated ingredient health guide (~78 entries, covering about 90% of TheMealDB's ingredients) |
| 🧺 **Can I make this?** | Every recipe rates how easy its ingredients are to find, suggests cheap swaps (salmon → tinned sardines, mascarpone → thick yogurt, wine → stock with lemon) and gives tips for cooking without an oven |
| 📖 **62 built-in recipes** | Dishes TheMealDB doesn't have, written for this app and available offline with real photos: 12 Ugandan home-style dishes, 7 African snacks (chin chin, puff-puff, koeksisters…), 16 Italian and American pizza styles, and 27 desserts from around the world (mochi, kulfi, cannoli, macarons, halo-halo…) |
| 🌍 **World kitchen** | 68 countries with flags and regions, the dishes from each, and food-safety tips for travellers |
| 🧒 **Kids' kitchen** | Age-band guidance (1–3, 4–8, 9–14), a 7-day meal plan of real recipes with kid-friendly tweaks, "superfoods", and golden rules |
| 🩺 **Health profile** | Pick the people you cook for and any allergies; recipes then show personal warnings |
| ♥ **My kitchen** | Saved recipes and a shopping list, kept on the device |
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
    (tabs)/            # Discover, Search, World, Kids, My kitchen
    country/[code].tsx # Dishes and travel tips for one country
    recipe/[id].tsx    # Recipe detail: ingredients, method, health
    cook/[id].tsx      # Cooking mode
    ingredient/[id].tsx# Ingredient health guide
    profile.tsx        # Household health profile
  components/          # UI building blocks, health panel, cards, tabs
  data/                # Ingredient health guide, availability & swaps, countries,
                       # travel tips, kids' plan
    recipes/           # Built-in recipes: uganda, african-snacks, pizza, desserts
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
- No backend, no API keys: TheMealDB's free public endpoint, with a small request queue and retry
  back-off so the app stays within its rate limit

## Photo credits

Photos of the built-in recipes come from [Wikimedia Commons](https://commons.wikimedia.org/) under free
licences and were resized for the app. Each recipe screen also credits its photo. Roman thin-crust
pizza has no photo yet, because no freely licensed picture of that exact style could be found.

| Recipe | Photo | Author | Licence |
| --- | --- | --- | --- |
| Rolex (Chapati Egg Roll) | [Well prepared rolex red to eat.jpg](https://commons.wikimedia.org/wiki/File:Well_prepared_rolex_red_to_eat.jpg) | Zahara5555 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Soft Layered Chapati | [Chapati kenya.jpg](https://commons.wikimedia.org/wiki/File:Chapati_kenya.jpg) | safaritravelplus | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| Kikomando (Chapati & Beans) | [Ekikomando 05.jpg](https://commons.wikimedia.org/wiki/File:Ekikomando_05.jpg) | Denis kasozi | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| Katogo (Matooke & Beans) | [Katogo of matooke and French beans with an avocado.jpg](https://commons.wikimedia.org/wiki/File:Katogo_of_matooke_and_French_beans_with_an_avocado.jpg) | B722N | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Matooke with Groundnut Sauce | [Plate of Matooke with Steamed Greens and Groundnut Sauce.jpg](https://commons.wikimedia.org/wiki/File:Plate_of_Matooke_with_Steamed_Greens_and_Groundnut_Sauce.jpg) | Nabunje Leticia | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Beans and Posho | [Africa ugali and beans.jpg](https://commons.wikimedia.org/wiki/File:Africa_ugali_and_beans.jpg) | Moseslukyamuzi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Chicken Luwombo | [Chicken Luwombo.JPG](https://commons.wikimedia.org/wiki/File:Chicken_Luwombo.JPG) | Namuganyi | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Malakwang (Sour Greens in Groundnut Sauce) | [Malakwang dish.jpg](https://commons.wikimedia.org/wiki/File:Malakwang_dish.jpg) | Alobo shalom | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Dodo (Amaranth Greens) | [Dodo ku sigiri.jpg](https://commons.wikimedia.org/wiki/File:Dodo_ku_sigiri.jpg) | Erinamukuta | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Millet Porridge (Obuuji) | [Millet porridge.png](https://commons.wikimedia.org/wiki/File:Millet_porridge.png) | Tiia Monto | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| Mukene (Silverfish) Stew | [Drying silver fish 02.jpg](https://commons.wikimedia.org/wiki/File:Drying_silver_fish_02.jpg) | Ssemmanda will | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Ugandan Beef Pilau | [Pilau Food in Kenya.jpg](https://commons.wikimedia.org/wiki/File:Pilau_Food_in_Kenya.jpg) | Cmwaura | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Chin Chin | [Bowl of fried Chin-Chin.jpg](https://commons.wikimedia.org/wiki/File:Bowl_of_fried_Chin-Chin.jpg) | Ceentia | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Puff-Puff | [Nigerian-puff-puff-recipe cropped.jpg](https://commons.wikimedia.org/wiki/File:Nigerian-puff-puff-recipe_cropped.jpg) | Afrolems ; cropped by Off-shell | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Plantain Chips | [Plantain chips.jpg](https://commons.wikimedia.org/wiki/File:Plantain_chips.jpg) | Scott Ehardt | Public domain |
| Nigerian Meat Pie | [A Northern Nigeria snacks called meat pie 22.jpg](https://commons.wikimedia.org/wiki/File:A_Northern_Nigeria_snacks_called_meat_pie_22.jpg) | Hajjare | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Kuli Kuli (Spiced Peanut Crunch) | [Kuli Kuli.jpg](https://commons.wikimedia.org/wiki/File:Kuli_Kuli.jpg) | Ei'eke | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Koeksisters | [Koeksisters.JPG](https://commons.wikimedia.org/wiki/File:Koeksisters.JPG) | DO'Neil (English Wikipedia) | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| Accra Banana (Banana Fritters) | [Claclo de banane des beignets de la banane plantin 01.jpg](https://commons.wikimedia.org/wiki/File:Claclo_de_banane_des_beignets_de_la_banane_plantin_01.jpg) | Mognissan | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Sicilian Pizza (Sfincione) | [Sfincione palermitano.jpg](https://commons.wikimedia.org/wiki/File:Sfincione_palermitano.jpg) | Rino Porrovecchio | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Pizza alla Pala | [Eataly Las Vegas - Feb 2019 - Sarah Stierch 02.jpg](https://commons.wikimedia.org/wiki/File:Eataly_Las_Vegas_-_Feb_2019_-_Sarah_Stierch_02.jpg) | Missvain | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) |
| Pizza Fritta (Fried Pizza) | [Pizza fritta.jpg](https://commons.wikimedia.org/wiki/File:Pizza_fritta.jpg) | Luca Sartoni from Vienna, Austria | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Pizza al Padellino (Turin Pan Pizza) | [Pizza al tegamino.jpg](https://commons.wikimedia.org/wiki/File:Pizza_al_tegamino.jpg) | Marco Gilardetti | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Calzone | [Tony's Pizza Napoletana Calzone (38067458042).jpg](https://commons.wikimedia.org/wiki/File:Tony%27s_Pizza_Napoletana_Calzone_%2838067458042%29.jpg) | Willis Lam | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| New York-Style Pizza | [New York Pizza Slices.png](https://commons.wikimedia.org/wiki/File:New_York_Pizza_Slices.png) | Contributorwiki12 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Chicago Deep-Dish Pizza | [Deep Dish Pizza PD.jpg](https://commons.wikimedia.org/wiki/File:Deep_Dish_Pizza_PD.jpg) | Telluride | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Chicago Tavern-Style Thin Crust | [Chicago thin crust pizza.jpg](https://commons.wikimedia.org/wiki/File:Chicago_thin_crust_pizza.jpg) | Shsilver (English Wikipedia) | Public domain |
| Detroit-Style Pizza | [Detroit style pizza in DC.jpg](https://commons.wikimedia.org/wiki/File:Detroit_style_pizza_in_DC.jpg) | Kurt Kaiser | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| St. Louis-Style Pizza | [St. Louis-style pizza (2).jpg](https://commons.wikimedia.org/wiki/File:St._Louis-style_pizza_%282%29.jpg) | Brian Johnson & Dane Kantner | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| New Haven White Clam Pizza | [White Clam Pizza.jpg](https://commons.wikimedia.org/wiki/File:White_Clam_Pizza.jpg) | ZhengZhou | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| California-Style BBQ Chicken Pizza | [Chicken BBQ Pizza.jpg](https://commons.wikimedia.org/wiki/File:Chicken_BBQ_Pizza.jpg) | Cbhavani02 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Quad Cities-Style Pizza | [QuadCityPizza.jpg](https://commons.wikimedia.org/wiki/File:QuadCityPizza.jpg) | Ericnotderek | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Rhode Island Pizza Strips | [Box o' strips.jpg](https://commons.wikimedia.org/wiki/File:Box_o%27_strips.jpg) | David Iannotti | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Grandma-Style Pizza | [Grandma-pizza-01.jpg](https://commons.wikimedia.org/wiki/File:Grandma-pizza-01.jpg) | Jeffrey Tastes | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Blondies | [Toffee blondies.jpg](https://commons.wikimedia.org/wiki/File:Toffee_blondies.jpg) | Bryan Ochalla | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Vanilla Cupcakes | [Vanilla cupcakes with lemon and mascarpone frosting and white chocolate curls.jpg](https://commons.wikimedia.org/wiki/File:Vanilla_cupcakes_with_lemon_and_mascarpone_frosting_and_white_chocolate_curls.jpg) | Steph Laing | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Peach Cobbler | [Peach cobbler (cropped).jpg](https://commons.wikimedia.org/wiki/File:Peach_cobbler_%28cropped%29.jpg) | Mark Pellegrini | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Cinnamon Rolls | [Cinnamon rolls glazed, July 2009.jpg](https://commons.wikimedia.org/wiki/File:Cinnamon_rolls_glazed,_July_2009.jpg) | grongar | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Fresh Fruit Tart | [Fruit tartlet with kiwi fruit and raspberries, 2008.jpg](https://commons.wikimedia.org/wiki/File:Fruit_tartlet_with_kiwi_fruit_and_raspberries,_2008.jpg) | Kimberly Vardeman | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Rustic Apple Galette | [Apple galette (3926990412).jpg](https://commons.wikimedia.org/wiki/File:Apple_galette_%283926990412%29.jpg) | Karen and Brad Emerson | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Cheese & Jam Danish Pastries | [Cheese danish - Massachusetts.jpg](https://commons.wikimedia.org/wiki/File:Cheese_danish_-_Massachusetts.jpg) | Daderot | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| Apple Strudel | [Wiener Apfelstrudel.jpg](https://commons.wikimedia.org/wiki/File:Wiener_Apfelstrudel.jpg) | Burkhard Mücke | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Quick Pain au Chocolat | [Pain au chocolat Luc Viatour.jpg](https://commons.wikimedia.org/wiki/File:Pain_au_chocolat_Luc_Viatour.jpg) | Luc Viatour | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| French Macarons | [Macarons, French made mini cakes.JPG](https://commons.wikimedia.org/wiki/File:Macarons,_French_made_mini_cakes.JPG) | Nicolas Halftermeyer | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Madeleines | [Madeleines de Commercy.jpg](https://commons.wikimedia.org/wiki/File:Madeleines_de_Commercy.jpg) | Bernard Leprêtre | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) |
| Mooncakes (Home-Style) | [Mooncake.jpg](https://commons.wikimedia.org/wiki/File:Mooncake.jpg) | Lybil BER | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Vanilla Gelato (No Machine) | [Vanilla bean ice cream (3086700978).jpg](https://commons.wikimedia.org/wiki/File:Vanilla_bean_ice_cream_%283086700978%29.jpg) | a.pasquier from bellingham, washington | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Ice Cream Cake | [Chocolate ice cream cake Groom's.jpg](https://commons.wikimedia.org/wiki/File:Chocolate_ice_cream_cake_Groom%27s.jpg) | Debs (ò‿ó)♪ | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Lemon Sorbet (Sorbetto al Limone) | [Lemon sorbet (4173840081).jpg](https://commons.wikimedia.org/wiki/File:Lemon_sorbet_%284173840081%29.jpg) | Rex Roof from Ann Arbor, MI, USA | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Berry Frozen Yogurt | [Berry Frozen Yogurt (4723048814).jpg](https://commons.wikimedia.org/wiki/File:Berry_Frozen_Yogurt_%284723048814%29.jpg) | Katie Munoz from New York City, United States of America | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Hawaiian Shave Ice | [Bon Dance Shave Ice.jpg](https://commons.wikimedia.org/wiki/File:Bon_Dance_Shave_Ice.jpg) | Pacamah | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| Kulfi (Pistachio Cardamom) | [Kulfi 3.jpg](https://commons.wikimedia.org/wiki/File:Kulfi_3.jpg) | Gaurav Dhwaj Khadka | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) |
| New Orleans Beignets | [Beignets - Cafe du Monde, Metairie, Louisiana 2015.jpg](https://commons.wikimedia.org/wiki/File:Beignets_-_Cafe_du_Monde,_Metairie,_Louisiana_2015.jpg) | leighklotz | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Funnel Cake | [Funnel cake 20040821 172200 1.1655x1275.jpg](https://commons.wikimedia.org/wiki/File:Funnel_cake_20040821_172200_1.1655x1275.jpg) | G. Edward Johnson | [CC BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) |
| Sicilian Cannoli | [Cannoli siciliani (7472226896).jpg](https://commons.wikimedia.org/wiki/File:Cannoli_siciliani_%287472226896%29.jpg) | mat's eye | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Yakgwa (Korean Honey Cookies) | [KOCIS yakgwa, honey cookies (4646996556).jpg](https://commons.wikimedia.org/wiki/File:KOCIS_yakgwa,_honey_cookies_%284646996556%29.jpg) | Korea.net / Korean Culture and Information Service | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Taiyaki (Fish-Shaped Cakes) | [Taiyaki 005.jpg](https://commons.wikimedia.org/wiki/File:Taiyaki_005.jpg) | Ocdp | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| Fruit Jelly | [Jelly Dessert Shaped in Bundt Pan.jpg](https://commons.wikimedia.org/wiki/File:Jelly_Dessert_Shaped_in_Bundt_Pan.jpg) | SutKartonu | [CC0](http://creativecommons.org/publicdomain/zero/1.0/deed.en) |
| Daifuku Mochi | [Daifuku 1.jpg](https://commons.wikimedia.org/wiki/File:Daifuku_1.jpg) | Lyzzy | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5) |
| Halo-Halo | [Halo halo1.jpg](https://commons.wikimedia.org/wiki/File:Halo_halo1.jpg) | bingbing from Quezon City, Philippines | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
| Fruit Popsicles | [Fruit ice lollies (8588758339).jpg](https://commons.wikimedia.org/wiki/File:Fruit_ice_lollies_%288588758339%29.jpg) | Lablascovegmenu from London | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) |
