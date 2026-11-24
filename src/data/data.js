/**
 * data.js — ALL the data of YallaWin lives in this file.
 *
 *  1. App settings       (categories, colours, fees)
 *  2. Menus & filters    (sidebar, tabs, home filters, sort options)
 *  3. Demo accounts      (users + organization)
 *  4. Demo events        (dates are "days from today", so the demo never gets old)
 *  5. Demo sales         (which events tickets are sold for)
 *  6. Demo reviews       (names, texts, replies, tags)
 *  7. Organization sign-up (types, event types, documents, steps)
 *
 * This file contains only plain data (no logic). src/data/seed.js turns it into
 * the initial database the first time the app opens.
 */

/* ======================= 1. APP SETTINGS ======================= */

/** Name of the app, shown in the hero, titles and logo. */
export const APP_NAME = 'YallaWin';

export const CATEGORIES = ['Workshop', 'Music', 'Nightlife', 'Sports', 'Tech', 'Adventure'];

/** Colours + emoji used for generated covers and thumbnails of each category. */
export const CATEGORY_THEMES = {
  Nightlife: { from: '#3a1410', to: '#c2562c', accent: '#ffb36b', emoji: '🪩' },
  Music: { from: '#f6e3c3', to: '#e7652c', accent: '#1d1d1d', emoji: '🎷' },
  Tech: { from: '#c9a6f2', to: '#7d4fd1', accent: '#f4e9ff', emoji: '🤖' },
  Sports: { from: '#8fd3f5', to: '#2f7fc1', accent: '#ffe7a3', emoji: '🏐' },
  Workshop: { from: '#d7b899', to: '#7a5238', accent: '#fff3e3', emoji: '🏺' },
  Adventure: { from: '#7fc28d', to: '#2b5f3a', accent: '#e9ffe9', emoji: '⛰️' },
};

/** Default description when an event has none. */
export const DEFAULT_DESCRIPTIONS = {
  Nightlife: 'A night of non-stop music, great people and the best sound system in town.',
  Music: 'Live music in an intimate setting — come early for the best spots.',
  Tech: 'Talks, demos and networking with builders from the Tunisian tech scene.',
  Sports: 'Friendly games, good vibes and a sunset by the sea.',
  Workshop: 'A hands-on session for beginners — all materials included.',
  Adventure: 'Get outside and explore — transport and guide included.',
};

export const REVIEW_TAGS = ['Great music', 'Smooth entry', 'Venue', 'Good value', 'Well organized', 'Crowded bar', 'Parking'];

/** YallaWin keeps 5% of ticket revenue. */
export const PLATFORM_FEE_RATE = 0.05;

/* ===================== 2. MENUS & FILTERS ====================== */

/** Organization dashboard sidebar. */
export const ORG_NAV = [
  { to: '/org', label: 'Overview', icon: 'overview' },
  { to: '/org/events', label: 'Events', icon: 'calendar' },
  { to: '/org/events/new', label: 'Create event', icon: 'plus' },
  { to: '/org/reviews', label: 'Reviews', icon: 'star' },
  { to: '/org/payouts', label: 'Payouts', icon: 'payouts' },
  { to: '/org/settings', label: 'Settings', icon: 'sliders' },
];

/** Home page top tabs. */
export const HOME_TABS = [
  { key: 'home', label: 'Home', icon: 'overview' },
  { key: 'going', label: 'Going To', icon: 'ticketPlain' },
  { key: 'mine', label: 'My Events', icon: 'sparkle' },
];

/** Dashboard › Events tabs. */
export const EVENT_TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'drafts', label: 'Drafts' },
  { key: 'past', label: 'Past' },
];

/** Dashboard › Reviews tabs. */
export const REVIEW_TABS = [
  { key: 'all', label: 'All' },
  { key: 'needs-reply', label: 'Needs reply' },
  { key: 'low', label: 'Low ratings' },
];

/** Home page category chips. */
export const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Music', label: 'Music' },
  { key: 'Nightlife', label: 'Night Life' },
  { key: 'Sports', label: 'Sports' },
  { key: 'Adventure', label: 'Adventure' },
  { key: 'Tech', label: 'Tech' },
  { key: 'Workshop', label: 'Workshop' },
];

/** Home page "Sort" menu. */
export const SORT_OPTIONS = [
  { key: 'soon', label: 'Soonest' },
  { key: 'popular', label: 'Most popular' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
];

/** Home page filters when nothing is selected. */
export const DEFAULT_HOME_FILTERS = { category: 'all', freeOnly: false, city: 'all', sort: 'soon' };

/* ======================= 3. DEMO ACCOUNTS ====================== */

/** Logins shown on the sign-in page ("Demo" buttons). */
export const DEMO_ACCOUNTS = {
  org: { email: 'contact@follamour.tn', password: 'Follamour2026', organizationId: 'ORG-FOLLAMOUR-2041' },
  user: { email: 'sarra@example.com', password: 'Sarra2026' },
};

/** Users. Passwords are hashed by seed.js before being stored. createdDaysAgo = account age. */
export const DEMO_USERS = [
  {
    id: 'usr_follamour',
    role: 'org',
    email: DEMO_ACCOUNTS.org.email,
    password: DEMO_ACCOUNTS.org.password,
    salt: 'a1f4c9e2b7d35a60',
    name: "Foll'Amour",
    orgId: 'org_follamour',
    favorites: [],
    createdDaysAgo: 420,
  },
  {
    id: 'usr_sarra',
    role: 'user',
    email: DEMO_ACCOUNTS.user.email,
    password: DEMO_ACCOUNTS.user.password,
    salt: '5c0e7b9a3d214f88',
    name: 'Sarra B.',
    orgId: null,
    favorites: ['evt_jazzin', 'evt_sunrise'],
    createdDaysAgo: 380,
  },
];

export const DEMO_ORGANIZATIONS = [
  {
    id: 'org_follamour',
    name: "Foll'Amour",
    ownerId: 'usr_follamour',
    verified: true,
    city: 'Gammarth, Tunis',
    bio: 'Music, nightlife and community events on the Gammarth coast since 2019.',
    contactEmail: DEMO_ACCOUNTS.org.email,
    payoutMethod: { holder: "Foll'Amour SARL", bank: 'BIAT' },
    organizationId: DEMO_ACCOUNTS.org.organizationId,
    type: 'company',
    website: 'instagram.com/follamour',
    eventTypes: ['Nightlife', 'Music'],
    documents: {
      rne: { name: 'extrait_RNE_follamour.pdf', size: 1258291 },
      adminId: { name: 'cin_admin.jpg', size: 860160 },
      venuePermit: { name: 'autorisation_lieu.pdf', size: 524288 },
      logo: { name: 'logo_follamour.png', size: 204800 },
    },
    verification: { status: 'approved' },
    createdDaysAgo: 420,
  },
];

/* ======================== 4. DEMO EVENTS ======================= */

const TERRACE = "Foll'Amour terrace, Gammarth";

/**
 * day = days from today (negative = in the past).
 * tiers = [name, price TND, quantity, sold]
 * status 'draft' | 'published' (default published). noCover = no generated cover image.
 */
export const DEMO_EVENTS = [
  // Upcoming
  { key: 'fabrika13', title: "Fabrika Fest'13", category: 'Nightlife', day: 3, start: '20:00', end: '04:00', venue: 'Fabrika, La Marsa', tiers: [['General', 45, 400, 368]] },
  { key: 'aisummit', title: 'AI Summit', category: 'Tech', day: 4, start: '16:30', end: '21:00', venue: "Foll'Amour Hall, Les Berges du Lac", tiers: [['General', 30, 250, 182]] },
  { key: 'torh', title: 'Torh Volley f Bhar', category: 'Sports', day: 10, start: '16:30', end: '19:30', venue: 'Plage de Gammarth', tiers: [['Player spot', 0, 60, 57]] },
  { key: 'jazzin', title: 'Jazz-in', category: 'Music', day: 16, start: '20:00', end: '23:30', venue: TERRACE, tiers: [['General', 30, 120, 120]] },
  { key: 'sunrise', title: 'Sunrise Hike: Zaghouan', category: 'Adventure', day: 18, start: '06:00', end: '13:00', venue: 'Zaghouan Mountain, Zaghouan', tiers: [['General', 20, 40, 24]] },
  { key: 'openmic', title: 'Open Mic Night', category: 'Music', day: 27, start: '21:00', end: '00:30', venue: TERRACE, tiers: [['General', 15, 80, 31]] },

  // Drafts
  {
    key: 'pottery',
    title: 'Sunset Pottery Session',
    category: 'Workshop',
    day: 21,
    start: '16:00',
    end: '19:00',
    venue: TERRACE,
    tiers: [
      ['General', 30, 16, 0],
      ['With a friend (×2)', 55, 4, 0],
    ],
    status: 'draft',
    noCover: true,
    description: 'Get your hands dirty at golden hour. A beginner-friendly wheel session on our terrace — clay, tools and tea included.',
  },
  { key: 'cinema', title: 'Rooftop Cinema Night', category: 'Nightlife', day: 35, start: '19:30', end: '22:30', venue: "Foll'Amour rooftop, Gammarth", tiers: [['General', 25, 60, 0]], status: 'draft' },

  // Past
  { key: 'fabrika12', title: "Fabrika Fest'12", category: 'Nightlife', day: -366, start: '20:00', end: '04:00', venue: 'Fabrika, La Marsa', tiers: [['General', 37, 400, 400]] },
  { key: 'garage4', title: 'Garage Session #4', category: 'Music', day: -23, start: '21:00', end: '01:00', venue: 'The Garage, La Marsa', tiers: [['General', 20, 150, 150]] },
  { key: 'halloween', title: 'Halloween Rave', category: 'Nightlife', day: -25, start: '22:00', end: '04:00', venue: 'Fabrika, La Marsa', tiers: [['General', 35, 300, 287]] },
  { key: 'garage3', title: 'Garage Session #3', category: 'Music', day: -55, start: '21:00', end: '01:00', venue: 'The Garage, La Marsa', tiers: [['General', 20, 150, 142]] },
  { key: 'kayak', title: 'Kayak Korbous', category: 'Adventure', day: -62, start: '08:00', end: '15:00', venue: 'Korbous beach, Nabeul', tiers: [['General', 40, 30, 30]] },
  { key: 'dojo', title: 'Coding Dojo', category: 'Tech', day: -70, start: '10:00', end: '17:00', venue: "Foll'Amour Hall, Les Berges du Lac", tiers: [['Free entry', 0, 50, 46]] },
  { key: 'closing', title: 'Summer Closing Party', category: 'Nightlife', day: -85, start: '21:00', end: '04:00', venue: 'Plage de Gammarth', tiers: [['General', 40, 350, 340]] },
  { key: 'salsa', title: 'Salsa Social', category: 'Music', day: -90, start: '20:00', end: '00:00', venue: TERRACE, tiers: [['General', 15, 100, 84]] },
  { key: 'claychill', title: 'Clay & Chill', category: 'Workshop', day: -95, start: '17:00', end: '20:00', venue: TERRACE, tiers: [['General', 30, 20, 20]] },
  { key: 'yoga', title: 'Beach Yoga Morning', category: 'Workshop', day: -110, start: '07:00', end: '09:00', venue: 'Plage de Gammarth', tiers: [['General', 10, 40, 38]] },
  { key: 'startup', title: 'Startup Night Tunis', category: 'Tech', day: -130, start: '18:00', end: '22:00', venue: "Foll'Amour Hall, Les Berges du Lac", tiers: [['General', 25, 200, 176]] },
  { key: 'photowalk', title: 'Medina Photo Walk', category: 'Adventure', day: -150, start: '09:00', end: '12:00', venue: 'Medina of Tunis', tiers: [['General', 15, 25, 25]] },
  { key: 'volleycup', title: 'Gammarth Volley Cup', category: 'Sports', day: -170, start: '15:00', end: '19:00', venue: 'Plage de Gammarth', tiers: [['Team spot', 10, 64, 64]] },
  { key: 'garage2', title: 'Garage Session #2', category: 'Music', day: -200, start: '21:00', end: '01:00', venue: 'The Garage, La Marsa', tiers: [['General', 20, 120, 120]] },
  { key: 'garage1', title: 'Garage Session #1', category: 'Music', day: -260, start: '21:00', end: '01:00', venue: 'The Garage, La Marsa', tiers: [['General', 20, 100, 92]] },
  { key: 'jazz25', title: 'Jazz-in', category: 'Music', day: -340, start: '20:00', end: '23:30', venue: TERRACE, tiers: [['General', 30, 120, 118]] },
];

/* ========================= 5. DEMO SALES ======================= */

/** Tickets sold in the last 30 days (the Overview chart total). */
export const SALES_LAST_30_DAYS = 1284;
/** How many days of sales history to generate. */
export const SALES_HISTORY_DAYS = 180;

/** Daily sales rotate between these events: [eventKey, price]. */
export const SALE_EVENTS = [
  ['fabrika13', 45],
  ['aisummit', 30],
  ['jazzin', 30],
  ['sunrise', 20],
  ['openmic', 15],
];

/** Tickets bought by the demo attendee: [eventKey, quantity, price, day]. */
export const DEMO_USER_TICKETS = [
  ['fabrika13', 2, 45, -35],
  ['garage4', 1, 20, -40],
  ['fabrika12', 2, 37, -380],
];

/* ======================== 6. DEMO REVIEWS ====================== */

/** First reviews shown on the Reviews page. {nextEventDay} is replaced by the date of Fabrika Fest'13. */
export const FEATURED_REVIEWS = [
  {
    authorName: 'Sarra B.',
    userId: 'usr_sarra',
    rating: 5,
    eventKey: 'fabrika12',
    daysAgo: 2,
    text: 'Incredible lineup and the venue was magical. Entry was smooth with the QR ticket — will be back next year!',
    tags: ['Great music', 'Smooth entry', 'Venue'],
    reply: { text: 'Thank you Sarra! The 13th edition is even bigger — see you on the {nextEventDay} 🎉', daysAgo: 1 },
  },
  {
    authorName: 'Mehdi T.',
    rating: 4,
    eventKey: 'fabrika12',
    daysAgo: 3,
    text: 'Best sound system I have heard in Tunis. Bars got crowded around 1 AM but staff handled it well.',
    tags: ['Great music', 'Crowded bar'],
    reply: null,
  },
  {
    authorName: 'Karim A.',
    rating: 3,
    eventKey: 'garage4',
    daysAgo: 7,
    text: 'Music was great but we waited 40 minutes at the entrance. Please add more check-in staff.',
    tags: ['Great music'],
    reply: null,
  },
];

/** How many generated reviews per star rating (+ the 3 featured = 128 reviews, average 4.7). */
export const RATING_DISTRIBUTION = { 5: 99, 4: 17, 3: 5, 2: 3, 1: 1 };

export const REVIEWER_NAMES = [
  'Yasmine K.', 'Amine B.', 'Ines M.', 'Omar H.', 'Nour S.', 'Skander R.', 'Lina C.', 'Youssef D.',
  'Rania F.', 'Aziz G.', 'Meriem L.', 'Hamza J.', 'Salma Z.', 'Walid N.', 'Ons T.', 'Firas E.',
  'Emna W.', 'Bilel A.', 'Asma O.', 'Rami K.', 'Chaima B.', 'Malek S.', 'Hiba R.', 'Seif M.',
];

export const REVIEW_TEXTS = {
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
  3: ['Good music but the queue at the entrance was long.', 'Nice idea, but it started almost an hour late.'],
  2: ['Too crowded and the sound was too loud where we were standing.', 'Expected more for the price.'],
  1: ['Waited over an hour to get in and missed the first set.'],
};

export const REVIEW_REPLIES = [
  'Thank you so much for coming — see you at the next one!',
  'Thanks for the kind words, we are glad you enjoyed it!',
  'Thanks for the feedback, we are already working on it for the next edition.',
  'Merci! It means a lot to the whole team.',
];

/** Events that receive most of the generated reviews. */
export const POPULAR_REVIEW_EVENTS = ['fabrika12', 'garage4', 'jazz25', 'closing', 'halloween', 'startup'];

/** How many generated reviews mention each tag: [tag, count]. */
export const REVIEW_TAG_COUNTS = [
  ['Great music', 61],
  ['Smooth entry', 40],
  ['Venue', 37],
  ['Good value', 27],
  ['Well organized', 25],
  ['Crowded bar', 11],
  ['Parking', 7],
];

/* =================== 7. ORGANIZATION SIGN-UP =================== */

/** Steps of "Apply to get verified". */
export const ORG_SIGNUP_STEPS = ['Organization', 'Documents', 'Review'];

/** "Organization type" buttons. */
export const ORG_TYPES = [
  { key: 'company', label: 'Company' },
  { key: 'club', label: 'University club' },
  { key: 'ngo', label: 'Association / NGO' },
  { key: 'collective', label: 'Collective' },
];

/** "What kind of events do you host?" chips. */
export const ORG_EVENT_TYPES = ['Nightlife', 'Music', 'Food', 'Sports', 'Workshops', 'Tech'];

/** Event types that need a venue permit (nightlife & outdoor events). */
export const PERMIT_EVENT_TYPES = ['Nightlife', 'Sports'];

/**
 * Documents asked in step 2. required: true = always needed,
 * 'permit' = needed only when the organization hosts PERMIT_EVENT_TYPES.
 */
export const ORG_DOCUMENTS = [
  { key: 'rne', label: 'Business registration (RNE extract)', short: 'RNE extract', hint: 'PDF or photo of your RNE extract', accept: '.pdf,image/png,image/jpeg', required: true },
  { key: 'adminId', label: 'Admin ID card (CIN / passport)', short: 'Admin ID', hint: 'Photo or scan, both sides', accept: '.pdf,image/png,image/jpeg', required: true },
  { key: 'venuePermit', label: 'Venue permit or authorization', short: 'Venue permit', hint: 'Required for nightlife & outdoor events', accept: '.pdf,image/png,image/jpeg', required: 'permit' },
  { key: 'logo', label: 'Logo', short: 'Logo', hint: 'Square, at least 400×400 px', accept: 'image/png,image/jpeg', required: false },
];

/** Biggest document accepted (in MB). */
export const MAX_DOCUMENT_MB = 10;

/**
 * The "trust team" review is simulated: an application is approved this many
 * seconds after it is submitted (in real life: 24–48h by a person).
 */
export const DEMO_REVIEW_SECONDS = 20;