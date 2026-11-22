/** Synchronous key-value storage backed by localStorage on web (no-op during server rendering). */
export const storage = {
  get(key: string): string | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the app still works in memory.
    }
  },
};
