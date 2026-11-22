import { useSyncExternalStore } from 'react';

import { storage } from '@/lib/storage';

/**
 * A tiny persisted store: state lives in memory, is saved to device storage on every change,
 * and components subscribe with `useSyncExternalStore`.
 */
export function createPersistedStore<T>(key: string, initial: T) {
  let state: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded) return;
    loaded = true;
    const raw = storage.get(key);
    if (raw) {
      try {
        state = { ...initial, ...JSON.parse(raw) };
      } catch {
        state = initial;
      }
    }
  };

  const getState = () => {
    load();
    return state;
  };

  const setState = (update: (prev: T) => T) => {
    state = update(getState());
    storage.set(key, JSON.stringify(state));
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore<S>(selector: (s: T) => S): S {
    return useSyncExternalStore(
      subscribe,
      () => selector(getState()),
      () => selector(initial),
    );
  }

  return { getState, setState, useStore };
}
