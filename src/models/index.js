/**
 * YallaWin JS data model.
 *
 * Collections stored in the database (src/data/db.js):
 *   users, organizations, events, sales, reviews, payouts
 *
 * @typedef {'user'|'org'} Role
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {Role}   role
 * @property {string} email          lower-cased, unique
 * @property {string} name
 * @property {string|null} orgId     set when role === 'org'
 * @property {string[]} favorites    saved event ids (attendees)
 * @property {string} salt
 * @property {string} passwordHash   sha256(salt:password)
 * @property {string} createdAt      ISO timestamp
 *
 * @typedef {Object} Organization
 * @property {string} id
 * @property {string} name
 * @property {string} ownerId
 * @property {boolean} verified
 * @property {string} city
 * @property {string} bio
 * @property {string} contactEmail
 * @property {{holder:string, bank:string}} payoutMethod
 * @property {string} createdAt
 *
 * @typedef {Object} TicketTier
 * @property {string} id
 * @property {string} name
 * @property {number} price      TND (0 = free)
 * @property {number} quantity   capacity of this tier
 * @property {number} sold
 *
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} orgId
 * @property {string} title
 * @property {string} category   one of CATEGORIES
 * @property {string} description
 * @property {string|null} coverImage   data URL
 * @property {string} date       YYYY-MM-DD
 * @property {string} startTime  HH:MM
 * @property {string} endTime    HH:MM (may be after midnight)
 * @property {string} venue
 * @property {TicketTier[]} tiers
 * @property {'draft'|'published'} status
 * @property {string} createdAt
 * @property {string} updatedAt
 *
 * @typedef {Object} Sale
 * @property {string} id
 * @property {string} orgId
 * @property {string} eventId
 * @property {string|null} tierId
 * @property {string|null} userId
 * @property {number} qty
 * @property {number} amount     TND
 * @property {string} date       YYYY-MM-DD
 * @property {string} createdAt
 *
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} orgId
 * @property {string} eventId
 * @property {string|null} userId
 * @property {string} authorName
 * @property {number} rating     1..5
 * @property {string} text
 * @property {string[]} tags
 * @property {{text:string, createdAt:string}|null} reply
 * @property {string} createdAt
 *
 * @typedef {Object} Payout
 * @property {string} id
 * @property {string} orgId
 * @property {string[]} eventIds
 * @property {number} gross
 * @property {number} fee
 * @property {number} net
 * @property {'processing'|'paid'} status
 * @property {string} createdAt
 */
import { uid } from '../utils/ids.js';
import { hashPassword, randomHex } from '../utils/crypto.js';
import { combineDateTime, addDays } from '../utils/dates.js';
import { CATEGORIES, PLATFORM_FEE_RATE, REVIEW_TAGS } from '../data/data.js';

export const ROLES = Object.freeze({ USER: 'user', ORG: 'org' });

// Categories, review tags and the platform fee are data: they live in src/data/data.js
export { CATEGORIES, PLATFORM_FEE_RATE, REVIEW_TAGS };

/* ----------------------------- validation ----------------------------- */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim());
}

/** Returns an error message, or '' when the password is acceptable. */
export function validatePassword(password) {
  if (!password || password.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Use both letters and numbers.';
  return '';
}

/* ------------------------------ factories ----------------------------- */

export function createUser({ name, email, password, role = ROLES.USER, orgId = null }) {
  const salt = randomHex(16);
  return {
    id: uid('usr'),
    role,
    email: String(email).trim().toLowerCase(),
    name: String(name).trim(),
    orgId,
    favorites: [],
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
}

export function createOrganization({ name, ownerId, contactEmail = '' }) {
  return {
    id: uid('org'),
    name: String(name).trim(),
    ownerId,
    verified: false,
    city: 'Tunis',
    bio: '',
    contactEmail,
    payoutMethod: { holder: String(name).trim(), bank: '' },
    createdAt: new Date().toISOString(),
  };
}

export function createTicketTier({ name = 'General', price = 30, quantity = 50, sold = 0 } = {}) {
  return { id: uid('tier'), name, price, quantity, sold };
}

export function createEvent({ orgId }) {
  const now = new Date().toISOString();
  return {
    id: uid('evt'),
    orgId,
    title: '',
    category: 'Workshop',
    description: '',
    coverImage: null,
    date: '',
    startTime: '18:00',
    endTime: '21:00',
    venue: '',
    tiers: [createTicketTier()],
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

export function createSale({ orgId, eventId, tierId = null, userId = null, qty, amount, date }) {
  return {
    id: uid('sal'),
    orgId,
    eventId,
    tierId,
    userId,
    qty,
    amount,
    date,
    createdAt: new Date().toISOString(),
  };
}

export function createReview({ orgId, eventId, userId = null, authorName, rating, text, tags = [] }) {
  return {
    id: uid('rev'),
    orgId,
    eventId,
    userId,
    authorName,
    rating,
    text: String(text).trim(),
    tags,
    reply: null,
    createdAt: new Date().toISOString(),
  };
}

/* --------------------------- derived helpers --------------------------- */

export function eventCapacity(event) {
  return event.tiers.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);
}

export function eventSold(event) {
  return event.tiers.reduce((sum, t) => sum + (Number(t.sold) || 0), 0);
}

export function eventRevenue(event) {
  return event.tiers.reduce((sum, t) => sum + (Number(t.price) || 0) * (Number(t.sold) || 0), 0);
}

export function isFreeEvent(event) {
  return event.tiers.length > 0 && event.tiers.every((t) => Number(t.price) === 0);
}

export function minPrice(event) {
  if (event.tiers.length === 0) return 0;
  return Math.min(...event.tiers.map((t) => Number(t.price) || 0));
}

export function eventStart(event) {
  return combineDateTime(event.date, event.startTime);
}

export function eventEnd(event) {
  const start = eventStart(event);
  let end = combineDateTime(event.date, event.endTime || event.startTime);
  if (!start || !end) return null;
  if (end <= start) end = addDays(end, 1); // finishes after midnight
  return end;
}

/**
 * Computed status shown in the UI.
 * @returns {'draft'|'ended'|'sold_out'|'almost_full'|'on_sale'}
 */
export function eventStatus(event, now = new Date()) {
  if (event.status === 'draft') return 'draft';
  const end = eventEnd(event);
  if (end && end < now) return 'ended';
  const capacity = eventCapacity(event);
  const sold = eventSold(event);
  if (capacity > 0 && sold >= capacity) return 'sold_out';
  const remaining = capacity - sold;
  if (capacity > 0 && remaining <= Math.max(3, Math.ceil(capacity * 0.05))) return 'almost_full';
  return 'on_sale';
}

export const STATUS_LABELS = {
  draft: 'Draft',
  ended: 'Ended',
  sold_out: 'Sold out',
  almost_full: 'Almost full',
  on_sale: 'On sale',
};

export function isUpcoming(event, now = new Date()) {
  const s = eventStatus(event, now);
  return s !== 'draft' && s !== 'ended';
}

/** Adds the year when another event has the same title, e.g. "Jazz-in (2025)". */
export function eventDisplayName(event, allEvents = []) {
  if (!event) return 'Deleted event';
  const duplicate = allEvents.some((e) => e.id !== event.id && e.title === event.title);
  return duplicate && event.date ? `${event.title} (${event.date.slice(0, 4)})` : event.title;
}

/* ---------------------------- publish rules ---------------------------- */

export function getPublishChecklist(event, organization) {
  return [
    { key: 'cover', label: 'Cover image', done: Boolean(event.coverImage) },
    {
      key: 'title',
      label: 'Title & category',
      done: event.title.trim().length >= 3 && CATEGORIES.includes(event.category),
    },
    {
      key: 'when',
      label: 'Date, time & venue',
      done: Boolean(event.date && event.startTime && event.endTime) && event.venue.trim().length >= 3,
    },
    {
      key: 'tiers',
      label: 'At least one ticket tier',
      done:
        event.tiers.length > 0 &&
        event.tiers.every(
          (t) => String(t.name).trim() && Number(t.quantity) > 0 && Number(t.price) >= 0 && t.price !== '',
        ),
    },
    { key: 'verified', label: 'Organization verified', done: Boolean(organization && organization.verified) },
  ];
}

/** Field-level validation. Returns an object of { field: message }. */
export function validateEventFields(event, { publish = false } = {}) {
  const errors = {};
  if (event.title.trim().length < 3) errors.title = 'Give your event a title (at least 3 characters).';
  if (event.title.trim().length > 80) errors.title = 'Keep the title under 80 characters.';
  if (event.description.length > 1000) errors.description = 'Keep the description under 1000 characters.';

  if (publish) {
    if (!event.date) errors.date = 'Pick a date.';
    if (!event.startTime) errors.startTime = 'Pick a start time.';
    if (!event.endTime) errors.endTime = 'Pick an end time.';
    if (event.startTime && event.endTime && event.startTime === event.endTime) {
      errors.endTime = 'End time must differ from start time.';
    }
    const start = eventStart(event);
    if (start && start < new Date()) errors.date = 'The event must start in the future.';
    if (event.venue.trim().length < 3) errors.venue = 'Add a venue.';
  }

  const tierErrors = {};
  event.tiers.forEach((t) => {
    const price = Number(t.price);
    const quantity = Number(t.quantity);
    if (!String(t.name).trim()) tierErrors[t.id] = 'Name this tier.';
    else if (t.price === '' || Number.isNaN(price) || price < 0) tierErrors[t.id] = 'Price must be 0 or more.';
    else if (t.quantity === '' || !Number.isInteger(quantity) || quantity < 1) {
      tierErrors[t.id] = 'Quantity must be a whole number ≥ 1.';
    } else if (quantity < (t.sold || 0)) tierErrors[t.id] = `Already ${t.sold} sold — quantity can't be lower.`;
  });
  if (Object.keys(tierErrors).length) errors.tiers = tierErrors;
  if (publish && event.tiers.length === 0) errors.tiersEmpty = 'Add at least one ticket tier.';
  return errors;
}

/** Returns a cleaned copy ready to be stored (numbers coerced, strings trimmed). */
export function normalizeEvent(event) {
  return {
    ...event,
    title: event.title.trim(),
    description: event.description.trim(),
    venue: event.venue.trim(),
    tiers: event.tiers.map((t) => ({
      ...t,
      name: String(t.name).trim(),
      price: Math.max(0, Number(t.price) || 0),
      quantity: Math.max(1, Math.floor(Number(t.quantity) || 1)),
      sold: Number(t.sold) || 0,
    })),
    updatedAt: new Date().toISOString(),
  };
}