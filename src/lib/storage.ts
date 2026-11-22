import Storage from 'expo-sqlite/kv-store';

/** Synchronous key-value storage backed by SQLite on iOS and Android. */
export const storage = {
  get(key: string): string | null {
    return Storage.getItemSync(key);
  },
  set(key: string, value: string) {
    Storage.setItemSync(key, value);
  },
};
