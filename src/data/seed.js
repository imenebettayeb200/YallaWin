/**
 * Demo data so the dashboards look like the Figma designs on first launch.
 * Dates are relative to "today", so the data always stays fresh.
 *
 * Demo accounts:
 *   Organization: contact@follamour.tn / Follamour2026
 *   Attendee:     sarra@example.com    / Sarra2026
 */
import { hashPassword } from '../utils/crypto.js';
import { addDays, startOfDay, toISODate } from '../utils/dates.js';
import { ordinal } from '../utils/format.js';
import { parseISODate } from '../utils/dates.js';
import { generateCover } from './artwork.js';
import { PLATFORM_FEE_RATE } from '../models/index.js';

export const DEMO_ACCOUNTS = {
  org: { email: 'contact@follamour.tn', password: 'Follamour2026' },
  user: { email: 'sarra@example.com', password: 'Sarra2026' },
};

/** Deterministic pseudo-random generator so the seed is the same every time. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const DEFAULT_DESCRIPTIONS = {
  Nightlife: 'A night of non-stop music, great people and the best sound system in town.',
  Music: 'Live music in an intimate setting — come early for the best spots.',
  Tech: 'Talks, demos and networking with builders from the Tunisian tech scene.',
  Sports: 'Friendly games, good vibes and a sunset by the sea.',
  Workshop: 'A hands-on session for beginners — all materials included.',
  Adventure: 'Get outside and explore — transport and guide included.',
};

export function seedDatabase(now = new Date()) {
  const today = startOfDay(now);
  const day = (offset) => toISODate(addDays(today, offset));
  const iso = (offset, hour = 12) => {
    const d = addDays(today, offset);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  /* ------------------------------ accounts ------------------------------ */
  const orgSalt = 'a1f4c9e2b7d35a60';
  const userSalt = '5c0e7b9a3d214f88';

  const orgOwner = {
    id: 'usr_follamour',
    role: 'org',
    email: DEMO_ACCOUNTS.org.email,
    name: "Foll'Amour",
    orgId: 'org_follamour',
    salt: orgSalt,
    passwordHash: hashPassword(DEMO_ACCOUNTS.org.password, orgSalt),
    createdAt: iso(-420),
  };

  const attendee = {
    id: 'usr_sarra',
    role: 'user',
    email: DEMO_ACCOUNTS.user.email,
    name: 'Sarra B.',
    orgId: null,
    salt: userSalt,
    passwordHash: hashPassword(DEMO_ACCOUNTS.user.password, userSalt),
    favorites: ['evt_jazzin', 'evt_sunrise'],
    createdAt: iso(-380),
  };

  const organization = {
    id: 'org_follamour',
    name: "Foll'Amour",
    ownerId: orgOwner.id,
    verified: true,
    city: 'Gammarth, Tunis',
    bio: 'Music, nightlife and community events on the Gammarth coast since 2019.',
    contactEmail: DEMO_ACCOUNTS.org.email,
    payoutMethod: { holder: "Foll'Amour SARL", bank: 'BIAT' },
    createdAt: iso(-420),
  };

  /* ------------------------------- events ------------------------------- */
  const makeEvent = (key, title, category, offset, startTime, endTime, venue, tiers, extra = {}) => ({
    id: `evt_${key}`,
    orgId: organization.id,
    title,
    category,
    description: extra.description || DEFAULT_DESCRIPTIONS[category],
    coverImage: extra.noCover ? null : generateCover(category, title),
    date: day(offset),
    startTime,
    endTime,
    venue,
    tiers: tiers.map(([name, price, quantity, sold], i) => ({
      id: `tier_${key}_${i}`,
      name,
      price,
      quantity,
      sold,
    })),
    status: extra.status || 'published',
    createdAt: iso(Math.min(offset, 0) - 45),
    updatedAt: iso(Math.min(offset, 0) - 10),
  });

  const terrace = "Foll'Amour terrace, Gammarth";

  const events = [
    // Upcoming (published)
    makeEvent('fabrika13', "Fabrika Fest'13", 'Nightlife', 3, '20:00', '04:00', 'Fabrika, La Marsa', [['General', 45, 400, 368]]),
    makeEvent('aisummit', 'AI Summit', 'Tech', 4, '16:30', '21:00', "Foll'Amour Hall, Les Berges du Lac", [['General', 30, 250, 182]]),
    makeEvent('torh', 'Torh Volley f Bhar', 'Sports', 10, '16:30', '19:30', 'Plage de Gammarth', [['Player spot', 0, 60, 57]]),
    makeEvent('jazzin', 'Jazz-in', 'Music', 16, '20:00', '23:30', terrace, [['General', 30, 120, 120]]),
    makeEvent('sunrise', 'Sunrise Hike: Zaghouan', 'Adventure', 18, '06:00', '13:00', 'Zaghouan Mountain, Zaghouan', [['General', 20, 40, 24]]),
    makeEvent('openmic', 'Open Mic Night', 'Music', 27, '21:00', '00:30', terrace, [['General', 15, 80, 31]]),

    // Drafts
    makeEvent(
      'pottery',
      'Sunset Pottery Session',
      'Workshop',
      21,
      '16:00',
      '19:00',
      terrace,
      [
        ['General', 30, 16, 0],
        ['With a friend (×2)', 55, 4, 0],
      ],
      {
        status: 'draft',
        noCover: true,
        description:
          'Get your hands dirty at golden hour. A beginner-friendly wheel session on our terrace — clay, tools and tea included.',
      },
    ),
    makeEvent('cinema', 'Rooftop Cinema Night', 'Nightlife', 35, '19:30', '22:30', "Foll'Amour rooftop, Gammarth", [['General', 25, 60, 0]], { status: 'draft' }),

    // Past
    makeEvent('fabrika12', "Fabrika Fest'12", 'Nightlife', -366, '20:00', '04:00', 'Fabrika, La Marsa', [['General', 37, 400, 400]]),
    makeEvent('garage4', 'Garage Session #4', 'Music', -23, '21:00', '01:00', 'The Garage, La Marsa', [['General', 20, 150, 150]]),
    makeEvent('halloween', 'Halloween Rave', 'Nightlife', -25, '22:00', '04:00', 'Fabrika, La Marsa', [['General', 35, 300, 287]]),
    makeEvent('garage3', 'Garage Session #3', 'Music', -55, '21:00', '01:00', 'The Garage, La Marsa', [['General', 20, 150, 142]]),
    makeEvent('kayak', 'Kayak Korbous', 'Adventure', -62, '08:00', '15:00', 'Korbous beach, Nabeul', [['General', 40, 30, 30]]),
    makeEvent('dojo', 'Coding Dojo', 'Tech', -70, '10:00', '17:00', "Foll'Amour Hall, Les Berges du Lac", [['Free entry', 0, 50, 46]]),
    makeEvent('closing', 'Summer Closing Party', 'Nightlife', -85, '21:00', '04:00', 'Plage de Gammarth', [['General', 40, 350, 340]]),
    makeEvent('salsa', 'Salsa Social', 'Music', -90, '20:00', '00:00', terrace, [['General', 15, 100, 84]]),
    makeEvent('claychill', 'Clay & Chill', 'Workshop', -95, '17:00', '20:00', terrace, [['General', 30, 20, 20]]),
    makeEvent('yoga', 'Beach Yoga Morning', 'Workshop', -110, '07:00', '09:00', 'Plage de Gammarth', [['General', 10, 40, 38]]),
    makeEvent('startup', 'Startup Night Tunis', 'Tech', -130, '18:00', '22:00', "Foll'Amour Hall, Les Berges du Lac", [['General', 25, 200, 176]]),
    makeEvent('photowalk', 'Medina Photo Walk', 'Adventure', -150, '09:00', '12:00', 'Medina of Tunis', [['General', 15, 25, 25]]),
    makeEvent('volleycup', 'Gammarth Volley Cup', 'Sports', -170, '15:00', '19:00', 'Plage de Gammarth', [['Team spot', 10, 64, 64]]),
    makeEvent('garage2', 'Garage Session #2', 'Music', -200, '21:00', '01:00', 'The Garage, La Marsa', [['General', 20, 120, 120]]),
    makeEvent('garage1', 'Garage Session #1', 'Music', -260, '21:00', '01:00', 'The Garage, La Marsa', [['General', 20, 100, 92]]),
    makeEvent('jazz25', 'Jazz-in', 'Music', -340, '20:00', '23:30', terrace, [['General', 30, 120, 118]]),
  ];

  /* ------------------------ ticket sales (180 days) ----------------------- */
  const random = rng(42);
  const DAYS = 180;
  const raw = [];
  for (let i = 0; i < DAYS; i += 1) {
    let w = 18 + (i / (DAYS - 1)) * 22 + 9 * Math.sin(i / 2.7) + random() * 12;
    if (i >= DAYS - 5) w *= 1.7; // last days before the big events
    raw.push(Math.max(2, w));
  }
  const TARGET_LAST_30 = 1284;
  const last30Raw = raw.slice(DAYS - 30).reduce((a, b) => a + b, 0);
  const scale = TARGET_LAST_30 / last30Raw;
  const qtys = raw.map((v) => Math.max(1, Math.round(v * scale)));
  const diff = TARGET_LAST_30 - qtys.slice(DAYS - 30).reduce((a, b) => a + b, 0);
  qtys[DAYS - 1] = Math.max(1, qtys[DAYS - 1] + diff);

  const salePool = [
    { eventId: 'evt_fabrika13', tierId: 'tier_fabrika13_0', price: 45 },
    { eventId: 'evt_aisummit', tierId: 'tier_aisummit_0', price: 30 },
    { eventId: 'evt_jazzin', tierId: 'tier_jazzin_0', price: 30 },
    { eventId: 'evt_sunrise', tierId: 'tier_sunrise_0', price: 20 },
    { eventId: 'evt_openmic', tierId: 'tier_openmic_0', price: 15 },
  ];
  const sales = qtys.map((qty, i) => {
    const offset = i - (DAYS - 1);
    const pick = salePool[i % salePool.length];
    return {
      id: `sal_seed_${i}`,
      orgId: organization.id,
      eventId: pick.eventId,
      tierId: pick.tierId,
      userId: null,
      qty,
      amount: qty * pick.price,
      date: day(offset),
      createdAt: iso(offset, 14),
    };
  });

  // Sarra's own tickets (bought more than 30 days ago, so the 30-day chart stays at 1,284)
  [
    ['evt_fabrika13', 'tier_fabrika13_0', 2, 45, -35],
    ['evt_garage4', 'tier_garage4_0', 1, 20, -40],
    ['evt_fabrika12', 'tier_fabrika12_0', 2, 37, -380],
  ].forEach(([eventId, tierId, qty, price, offset], i) => {
    sales.push({
      id: `sal_sarra_${i}`,
      orgId: organization.id,
      eventId,
      tierId,
      userId: attendee.id,
      qty,
      amount: qty * price,
      date: day(offset),
      createdAt: iso(offset, 19),
    });
  });

  /* ------------------------------- reviews ------------------------------ */
  const fabrika13Date = parseISODate(day(3));
  const featured = [
    {
      authorName: 'Sarra B.',
      userId: attendee.id,
      rating: 5,
      eventId: 'evt_fabrika12',
      daysAgo: 2,
      text: 'Incredible lineup and the venue was magical. Entry was smooth with the QR ticket — will be back next year!',
      tags: ['Great music', 'Smooth entry', 'Venue'],
      reply: {
        text: `Thank you Sarra! The 13th edition is even bigger — see you on the ${ordinal(fabrika13Date.getDate())} 🎉`,
        daysAgo: 1,
      },
    },
    {
      authorName: 'Mehdi T.',
      rating: 4,
      eventId: 'evt_fabrika12',
      daysAgo: 3,
      text: 'Best sound system I have heard in Tunis. Bars got crowded around 1 AM but staff handled it well.',
      tags: ['Great music', 'Crowded bar'],
      reply: null,
    },
    {
      authorName: 'Karim A.',
      rating: 3,
      eventId: 'evt_garage4',
      daysAgo: 7,
      text: 'Music was great but we waited 40 minutes at the entrance. Please add more check-in staff.',
      tags: ['Great music'],
      reply: null,
    },
  ];

  const NAMES = [
    'Yasmine K.', 'Amine B.', 'Ines M.', 'Omar H.', 'Nour S.', 'Skander R.', 'Lina C.', 'Youssef D.',
    'Rania F.', 'Aziz G.', 'Meriem L.', 'Hamza J.', 'Salma Z.', 'Walid N.', 'Ons T.', 'Firas E.',
    'Emna W.', 'Bilel A.', 'Asma O.', 'Rami K.', 'Chaima B.', 'Malek S.', 'Hiba R.', 'Seif M.',
  ];
  const TEXTS = {
    5: [
      'Amazing night, the crowd and the music were perfect. Already waiting for the next one!',
      'Super well organized from start to finish. Worth every dinar.',
      'Best event I have been to this year. The venue is stunning.',
      'Great vibes, friendly staff and the QR entry was super fast.',
      'Loved every minute. The lineup was on point.',
      'Such a beautiful atmosphere — brought friends and they loved it too.',
    ],
    4: [
      'Really good event, just a bit crowded near the bar.',
      'Great music and venue. Parking was a little hard to find.',
      'Very nice evening, would have loved a longer set from the headliner.',
    ],
    3: [
      'Good music but the queue at the entrance was long.',
      'Nice idea, but it started almost an hour late.',
    ],
    2: ['Too crowded and the sound was too loud where we were standing.', 'Expected more for the price.'],
    1: ['Waited over an hour to get in and missed the first set.'],
  };
  const REPLIES = [
    'Thank you so much for coming — see you at the next one!',
    'Thanks for the kind words, we are glad you enjoyed it!',
    'Thanks for the feedback, we are already working on it for the next edition.',
    'Merci! It means a lot to the whole team.',
  ];

  // Distribution: 100×5★, 18×4★, 6×3★, 3×2★, 1×1★ (= 128 reviews incl. featured)
  const ratings = [];
  const pushN = (value, n) => {
    for (let i = 0; i < n; i += 1) ratings.push(value);
  };
  pushN(5, 99);
  pushN(4, 17);
  pushN(3, 5);
  pushN(2, 3);
  pushN(1, 1);
  for (let i = ratings.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [ratings[i], ratings[j]] = [ratings[j], ratings[i]];
  }

  const pastEvents = events
    .filter((e) => e.status === 'published' && parseISODate(e.date) < today)
    .map((e) => ({ id: e.id, offset: Math.round((parseISODate(e.date) - today) / 86400000) }));
  const preferred = ['evt_fabrika12', 'evt_garage4', 'evt_jazz25', 'evt_closing', 'evt_halloween', 'evt_startup'];

  const tagTargets = [
    ['Great music', 61, 7],
    ['Smooth entry', 40, 11],
    ['Venue', 37, 13],
    ['Good value', 27, 17],
    ['Well organized', 25, 19],
    ['Crowded bar', 11, 23],
    ['Parking', 7, 29],
  ];

  const total = ratings.length; // 125
  const noReplyIndexes = new Set([ratings.indexOf(2), ratings.indexOf(4), ratings.lastIndexOf(4)]);
  const generated = ratings.map((rating, j) => {
    const daysAgo = 8 + Math.floor(j * 2.75) + Math.floor(random() * 3);
    const candidates = pastEvents.filter((e) => e.offset <= -daysAgo);
    const preferredCandidates = candidates.filter((e) => preferred.includes(e.id));
    const pool = preferredCandidates.length && random() < 0.75 ? preferredCandidates : candidates;
    const eventId = pool.length ? pool[Math.floor(random() * pool.length)].id : 'evt_fabrika12';
    const tags = tagTargets
      .filter(([, count, prime]) => (j * prime + 5) % total < count)
      .map(([tag]) => tag);
    const texts = TEXTS[rating];
    return {
      authorName: NAMES[j % NAMES.length],
      rating,
      eventId,
      daysAgo,
      text: texts[j % texts.length],
      tags,
      reply: noReplyIndexes.has(j) ? null : { text: REPLIES[j % REPLIES.length], daysAgo: Math.max(0, daysAgo - 1) },
    };
  });

  const reviews = [...featured, ...generated].map((r, i) => ({
    id: `rev_seed_${i}`,
    orgId: organization.id,
    eventId: r.eventId,
    userId: r.userId || null,
    authorName: r.authorName,
    rating: r.rating,
    text: r.text,
    tags: r.tags,
    reply: r.reply ? { text: r.reply.text, createdAt: iso(-r.reply.daysAgo, 18) } : null,
    createdAt: iso(-r.daysAgo, 11),
  }));

  /* ------------------------------- payouts ------------------------------ */
  const payouts = events
    .filter((e) => e.status === 'published' && parseISODate(e.date) < addDays(today, -24))
    .map((e) => {
      const gross = e.tiers.reduce((s, t) => s + t.price * t.sold, 0);
      return { e, gross };
    })
    .filter(({ gross }) => gross > 0)
    .map(({ e, gross }) => {
      const fee = Math.round(gross * PLATFORM_FEE_RATE);
      const paidOn = addDays(parseISODate(e.date), 7);
      return {
        id: `pay_seed_${e.id}`,
        orgId: organization.id,
        eventIds: [e.id],
        gross,
        fee,
        net: gross - fee,
        status: 'paid',
        createdAt: paidOn.toISOString(),
      };
    });

  return {
    meta: { version: 1, seededAt: now.toISOString() },
    users: [orgOwner, attendee],
    organizations: [organization],
    events,
    sales,
    reviews,
    payouts,
  };
}
