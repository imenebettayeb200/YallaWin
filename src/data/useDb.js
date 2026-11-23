import { useSyncExternalStore } from 'react';
import { db } from './db.js';

/** Whole database state; re-renders on every write. */
export function useDbState() {
  return useSyncExternalStore(db.subscribe, db.getState);
}

/** One collection, e.g. useCollection('events'). */
export function useCollection(name) {
  return useDbState()[name];
}
