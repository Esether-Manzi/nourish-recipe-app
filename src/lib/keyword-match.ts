/** Shared ingredient-name matching used by the health guide and the availability guide. */

export const normalizeIngredient = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Builds a matcher that finds the entry whose keyword is the longest whole-word match in an
 * ingredient name, so "coconut milk" beats "milk" and "eggplant" never matches "egg".
 */
export function createKeywordMatcher<T>(entries: T[], keywordsOf: (entry: T) => string[]) {
  const keywords = entries
    .flatMap((entry) =>
      keywordsOf(entry).map((keyword) => {
        const key = normalizeIngredient(keyword);
        return {
          entry,
          length: key.length,
          regex: new RegExp(`(^|\\s)${escapeRegex(key)}(s|es)?(?=\\s|$)`),
        };
      }),
    )
    .sort((a, b) => b.length - a.length);

  const cache = new Map<string, T | null>();

  return (name: string): T | null => {
    const key = normalizeIngredient(name);
    if (cache.has(key)) return cache.get(key)!;
    const found = keywords.find((k) => k.regex.test(key))?.entry ?? null;
    cache.set(key, found);
    return found;
  };
}
