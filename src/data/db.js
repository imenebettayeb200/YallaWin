/**
 * Tiny document database persisted in localStorage.
 * Every write creates a new immutable state object and notifies subscribers,
 * so React components re-render automatically (see useDb.js).
 */
import { seedDatabase } from './seed.js';

const STORAGE_KEY = 'yallawin_db_v2'; // v2: organizations have an OrganizationID
export const COLLECTIONS = ['users', 'organizations', 'events', 'sales', 'reviews', 'payouts'];

let state = null;
const listeners = new Set();

function isValidState(value) {
  return Boolean(value) && COLLECTIONS.every((name) => Array.isArray(value[name]));
}

function persist(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch (error) {
    console.error('[db] Could not save to localStorage (storage may be full).', error);
    return false;
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidState(parsed)) return parsed;
    }
  } catch (error) {
    console.warn('[db] Stored data was unreadable, re-seeding.', error);
  }
  const seeded = seedDatabase();
  persist(seeded);
  return seeded;
}

function getState() {
  if (state === null) state = load();
  return state;
}

function commit(next) {
  const saved = persist(next);
  if (!saved) {
    throw new Error('Could not save your changes — browser storage is full. Try a smaller cover image.');
  }
  state = next;
  listeners.forEach((listener) => listener());
}

function assertCollection(name) {
  if (!COLLECTIONS.includes(name)) throw new Error(`[db] Unknown collection "${name}"`);
}

export const db = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getState,

  all(collection) {
    assertCollection(collection);
    return getState()[collection];
  },

  findById(collection, id) {
    assertCollection(collection);
    return getState()[collection].find((r) => r.id === id) || null;
  },

  findOne(collection, predicate) {
    assertCollection(collection);
    return getState()[collection].find(predicate) || null;
  },

  filter(collection, predicate) {
    assertCollection(collection);
    return getState()[collection].filter(predicate);
  },

  insert(collection, record) {
    assertCollection(collection);
    const current = getState();
    if (current[collection].some((r) => r.id === record.id)) {
      throw new Error(`[db] Duplicate id ${record.id} in ${collection}`);
    }
    commit({ ...current, [collection]: [...current[collection], record] });
    return record;
  },

  /** patch can be an object or a function (record) => partial */
  update(collection, id, patch) {
    assertCollection(collection);
    const current = getState();
    let updated = null;
    const list = current[collection].map((r) => {
      if (r.id !== id) return r;
      const changes = typeof patch === 'function' ? patch(r) : patch;
      updated = { ...r, ...changes };
      return updated;
    });
    if (!updated) throw new Error(`[db] ${collection}/${id} not found`);
    commit({ ...current, [collection]: list });
    return updated;
  },

  upsert(collection, record) {
    return this.findById(collection, record.id) ? this.update(collection, record.id, record) : this.insert(collection, record);
  },

  remove(collection, id) {
    assertCollection(collection);
    const current = getState();
    commit({ ...current, [collection]: current[collection].filter((r) => r.id !== id) });
  },

  /** Several writes as one commit: fn receives a mutable draft copy of the collections. */
  transaction(fn) {
    const current = getState();
    const draft = { ...current };
    COLLECTIONS.forEach((name) => {
      draft[name] = [...current[name]];
    });
    const result = fn(draft);
    commit(draft);
    return result;
  },

  reset() {
    commit(seedDatabase());
  },
};

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const parsed = JSON.parse(event.newValue);
      if (isValidState(parsed)) {
        state = parsed;
        listeners.forEach((listener) => listener());
      }
    } catch {
      /* ignore */
    }
  });
}