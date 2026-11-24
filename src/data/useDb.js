import { useEffect, useState } from 'react';
import { db } from './db.js';

/**
 * useDbState — gives a component the whole database and re-renders it on every change.
 *
 * useState  keeps the current database in the component.
 * useEffect subscribes to the database when the component appears, and
 *           unsubscribes when it disappears (the returned cleanup function).
 */
export function useDbState() {
  const [state, setState] = useState(() => db.getState());

  useEffect(() => {
    const update = () => setState(db.getState());
    update(); // catch changes made before the subscription started
    const unsubscribe = db.subscribe(update);
    return unsubscribe;
  }, []);

  return state;
}

/** One collection, e.g. useCollection('events'). */
export function useCollection(name) {
  return useDbState()[name];
}