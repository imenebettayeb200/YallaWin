import { randomHex } from './crypto.js';

/** Unique, sortable-ish id like "evt_lq3k2a9f3c1b". */
export function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}${randomHex(3)}`;
}
