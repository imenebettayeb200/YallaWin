/**
 * seed.js — builds the first database from the plain data in data.js.
 * No data is written here: only the logic (dates relative to today, password
 * hashing, generated sales history and reviews).
 */
import {
  DEFAULT_DESCRIPTIONS,
  DEMO_EVENTS,
  DEMO_ORGANIZATIONS,
  DEMO_USERS,
  DEMO_USER_TICKETS,
  FEATURED_REVIEWS,
  PLATFORM_FEE_RATE,
  POPULAR_REVIEW_EVENTS,
  RATING_DISTRIBUTION,
  REVIEWER_NAMES,
  REVIEW_REPLIES,
  REVIEW_TAG_COUNTS,
  REVIEW_TEXTS,
  SALE_EVENTS,
  SALES_HISTORY_DAYS,
  SALES_LAST_30_DAYS,
} from './data.js';
import { generateCover } from './artwork.js';
import { hashPassword } from '../utils/crypto.js';
import { addDays, parseISODate, startOfDay, toISODate } from '../utils/dates.js';
import { ordinal } from '../utils/format.js';

/** Same pseudo-random numbers every time, so the demo always looks the same. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const eventId = (key) => `evt_${key}`;
const tierId = (key, index = 0) => `tier_${key}_${index}`;

export function seedDatabase(now = new Date()) {
  const today = startOfDay(now);
  const day = (offset) => toISODate(addDays(today, offset));
  const iso = (offset, hour = 12) => {
    const d = addDays(today, offset);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };
  const random = rng(42);
  const org = DEMO_ORGANIZATIONS[0];

  /* ------------------------ users & organizations ------------------------ */
  const users = DEMO_USERS.map(({ password, createdDaysAgo, ...u }) => ({
    ...u,
    passwordHash: hashPassword(password, u.salt),
    createdAt: iso(-createdDaysAgo),
  }));

  const organizations = DEMO_ORGANIZATIONS.map(({ createdDaysAgo, ...o }) => ({ ...o, createdAt: iso(-createdDaysAgo) }));

  /* -------------------------------- events ------------------------------- */
  const events = DEMO_EVENTS.map((e) => ({
    id: eventId(e.key),
    orgId: org.id,
    title: e.title,
    category: e.category,
    description: e.description || DEFAULT_DESCRIPTIONS[e.category],
    coverImage: e.noCover ? null : generateCover(e.category, e.title),
    date: day(e.day),
    startTime: e.start,
    endTime: e.end,
    venue: e.venue,
    tiers: e.tiers.map(([name, price, quantity, sold], i) => ({ id: tierId(e.key, i), name, price, quantity, sold })),
    status: e.status || 'published',
    createdAt: iso(Math.min(e.day, 0) - 45),
    updatedAt: iso(Math.min(e.day, 0) - 10),
  }));

  /* ------------------------ ticket sales history ------------------------- */
  const DAYS = SALES_HISTORY_DAYS;
  const raw = [];
  for (let i = 0; i < DAYS; i += 1) {
    let w = 18 + (i / (DAYS - 1)) * 22 + 9 * Math.sin(i / 2.7) + random() * 12;
    if (i >= DAYS - 5) w *= 1.7; // rush before the big events
    raw.push(Math.max(2, w));
  }
  const scale = SALES_LAST_30_DAYS / raw.slice(DAYS - 30).reduce((a, b) => a + b, 0);
  const qtys = raw.map((v) => Math.max(1, Math.round(v * scale)));
  const diff = SALES_LAST_30_DAYS - qtys.slice(DAYS - 30).reduce((a, b) => a + b, 0);
  qtys[DAYS - 1] = Math.max(1, qtys[DAYS - 1] + diff);

  const sales = qtys.map((qty, i) => {
    const offset = i - (DAYS - 1);
    const [key, price] = SALE_EVENTS[i % SALE_EVENTS.length];
    return {
      id: `sal_seed_${i}`,
      orgId: org.id,
      eventId: eventId(key),
      tierId: tierId(key),
      userId: null,
      qty,
      amount: qty * price,
      date: day(offset),
      createdAt: iso(offset, 14),
    };
  });

  const attendee = DEMO_USERS.find((u) => u.role === 'user');
  DEMO_USER_TICKETS.forEach(([key, qty, price, offset], i) => {
    sales.push({
      id: `sal_user_${i}`,
      orgId: org.id,
      eventId: eventId(key),
      tierId: tierId(key),
      userId: attendee.id,
      qty,
      amount: qty * price,
      date: day(offset),
      createdAt: iso(offset, 19),
    });
  });

  /* -------------------------------- reviews ------------------------------ */
  const nextEventDay = ordinal(parseISODate(day(DEMO_EVENTS[0].day)).getDate());
  const featured = FEATURED_REVIEWS.map((r) => ({
    ...r,
    eventId: eventId(r.eventKey),
    reply: r.reply ? { ...r.reply, text: r.reply.text.replace('{nextEventDay}', nextEventDay) } : null,
  }));

  const ratings = [];
  [5, 4, 3, 2, 1].forEach((star) => {
    for (let i = 0; i < RATING_DISTRIBUTION[star]; i += 1) ratings.push(star);
  });
  for (let i = ratings.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [ratings[i], ratings[j]] = [ratings[j], ratings[i]];
  }

  const pastEvents = events
    .filter((e) => e.status === 'published' && parseISODate(e.date) < today)
    .map((e) => ({ id: e.id, offset: Math.round((parseISODate(e.date) - today) / 86400000) }));
  const popular = POPULAR_REVIEW_EVENTS.map(eventId);
  const TAG_PRIMES = [7, 11, 13, 17, 19, 23, 29]; // spreads each tag evenly over the reviews
  const total = ratings.length;
  const noReply = new Set([ratings.indexOf(2), ratings.indexOf(4), ratings.lastIndexOf(4)]);

  const generated = ratings.map((rating, j) => {
    const daysAgo = 8 + Math.floor(j * 2.75) + Math.floor(random() * 3);
    const candidates = pastEvents.filter((e) => e.offset <= -daysAgo);
    const popularCandidates = candidates.filter((e) => popular.includes(e.id));
    const pool = popularCandidates.length && random() < 0.75 ? popularCandidates : candidates;
    const texts = REVIEW_TEXTS[rating];
    return {
      authorName: REVIEWER_NAMES[j % REVIEWER_NAMES.length],
      rating,
      eventId: pool.length ? pool[Math.floor(random() * pool.length)].id : eventId('fabrika12'),
      daysAgo,
      text: texts[j % texts.length],
      tags: REVIEW_TAG_COUNTS.filter(([, count], t) => (j * TAG_PRIMES[t] + 5) % total < count).map(([tag]) => tag),
      reply: noReply.has(j) ? null : { text: REVIEW_REPLIES[j % REVIEW_REPLIES.length], daysAgo: Math.max(0, daysAgo - 1) },
    };
  });

  const reviews = [...featured, ...generated].map((r, i) => ({
    id: `rev_seed_${i}`,
    orgId: org.id,
    eventId: r.eventId,
    userId: r.userId || null,
    authorName: r.authorName,
    rating: r.rating,
    text: r.text,
    tags: r.tags,
    reply: r.reply ? { text: r.reply.text, createdAt: iso(-r.reply.daysAgo, 18) } : null,
    createdAt: iso(-r.daysAgo, 11),
  }));

  /* -------------------------------- payouts ------------------------------ */
  const payouts = events
    .filter((e) => e.status === 'published' && parseISODate(e.date) < addDays(today, -24))
    .map((e) => ({ e, gross: e.tiers.reduce((s, t) => s + t.price * t.sold, 0) }))
    .filter(({ gross }) => gross > 0)
    .map(({ e, gross }) => {
      const fee = Math.round(gross * PLATFORM_FEE_RATE);
      return {
        id: `pay_seed_${e.id}`,
        orgId: org.id,
        eventIds: [e.id],
        gross,
        fee,
        net: gross - fee,
        status: 'paid',
        createdAt: addDays(parseISODate(e.date), 7).toISOString(),
      };
    });

  return {
    meta: { version: 2, seededAt: now.toISOString() },
    users,
    organizations,
    events,
    sales,
    reviews,
    payouts,
  };
}