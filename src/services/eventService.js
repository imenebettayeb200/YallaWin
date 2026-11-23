import { db } from '../data/db.js';
import {
  createReview,
  createSale,
  eventEnd,
  eventRevenue,
  eventSold,
  eventStatus,
  normalizeEvent,
  PLATFORM_FEE_RATE,
} from '../models/index.js';
import { toISODate } from '../utils/dates.js';
import { uid } from '../utils/ids.js';

/** Creates or updates an event owned by orgId. */
export function saveEvent(orgId, event, { publish }) {
  const existing = db.findById('events', event.id);
  if (existing && existing.orgId !== orgId) throw new Error('You cannot edit this event.');
  const record = normalizeEvent({
    ...event,
    orgId,
    status: publish ? 'published' : existing && existing.status === 'published' ? 'published' : 'draft',
  });
  return db.upsert('events', record);
}

export function deleteEvent(orgId, eventId) {
  const event = db.findById('events', eventId);
  if (!event || event.orgId !== orgId) throw new Error('Event not found.');
  if (eventSold(event) > 0) throw new Error('This event already has ticket sales and cannot be deleted.');
  db.remove('events', eventId);
}

/** Attendee buys tickets: updates the tier and records a sale in one commit. */
export function buyTicket({ eventId, tierId, userId, qty = 1 }) {
  const quantity = Math.floor(Number(qty));
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('Choose between 1 and 10 tickets.');

  return db.transaction((draft) => {
    const index = draft.events.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error('Event not found.');
    const event = draft.events[index];
    const status = eventStatus(event);
    if (status === 'draft' || status === 'ended') throw new Error('Tickets are not on sale for this event.');
    const tier = event.tiers.find((t) => t.id === tierId);
    if (!tier) throw new Error('Ticket type not found.');
    const remaining = tier.quantity - tier.sold;
    if (remaining < quantity) {
      throw new Error(remaining === 0 ? 'This ticket type is sold out.' : `Only ${remaining} ticket(s) left.`);
    }
    draft.events[index] = {
      ...event,
      tiers: event.tiers.map((t) => (t.id === tierId ? { ...t, sold: t.sold + quantity } : t)),
    };
    const sale = createSale({
      orgId: event.orgId,
      eventId,
      tierId,
      userId,
      qty: quantity,
      amount: quantity * tier.price,
      date: toISODate(new Date()),
    });
    draft.sales.push(sale);
    return sale;
  });
}

export function replyToReview(orgId, reviewId, text) {
  const clean = String(text || '').trim();
  if (clean.length < 2) throw new Error('Write a reply first.');
  if (clean.length > 500) throw new Error('Keep replies under 500 characters.');
  const review = db.findById('reviews', reviewId);
  if (!review || review.orgId !== orgId) throw new Error('Review not found.');
  return db.update('reviews', reviewId, { reply: { text: clean, createdAt: new Date().toISOString() } });
}

export function addReview({ eventId, user, rating, text }) {
  const event = db.findById('events', eventId);
  if (!event) throw new Error('Event not found.');
  const end = eventEnd(event);
  if (!end || end > new Date()) throw new Error('You can review an event after it ends.');
  const value = Number(rating);
  if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error('Pick a rating from 1 to 5 stars.');
  if (String(text || '').trim().length < 5) throw new Error('Tell us a bit more (at least 5 characters).');
  if (db.findOne('reviews', (r) => r.eventId === eventId && r.userId === user.id)) {
    throw new Error('You already reviewed this event.');
  }
  return db.insert(
    'reviews',
    createReview({ orgId: event.orgId, eventId, userId: user.id, authorName: user.name, rating: value, text }),
  );
}

/* ------------------------------- payouts ------------------------------ */

export function payoutSummary(state, orgId) {
  const paidOutEventIds = new Set(
    state.payouts.filter((p) => p.orgId === orgId).flatMap((p) => p.eventIds),
  );
  const orgEvents = state.events.filter((e) => e.orgId === orgId && e.status === 'published');
  const ended = orgEvents.filter((e) => eventStatus(e) === 'ended' && eventRevenue(e) > 0);
  const available = ended.filter((e) => !paidOutEventIds.has(e.id));
  const availableGross = available.reduce((s, e) => s + eventRevenue(e), 0);
  const availableNet = Math.round(availableGross * (1 - PLATFORM_FEE_RATE));
  const pendingGross = orgEvents
    .filter((e) => eventStatus(e) !== 'ended')
    .reduce((s, e) => s + eventRevenue(e), 0);
  const payouts = state.payouts
    .filter((p) => p.orgId === orgId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const paidTotal = payouts.filter((p) => p.status === 'paid').reduce((s, p) => s + p.net, 0);
  const processingTotal = payouts.filter((p) => p.status === 'processing').reduce((s, p) => s + p.net, 0);
  return { available, availableGross, availableNet, pendingGross, payouts, paidTotal, processingTotal };
}

export function requestPayout(orgId) {
  const state = db.getState();
  const organization = state.organizations.find((o) => o.id === orgId);
  if (!organization) throw new Error('Organization not found.');
  if (!organization.payoutMethod || !organization.payoutMethod.bank.trim() || !organization.payoutMethod.holder.trim()) {
    throw new Error('Add your bank details first.');
  }
  const { available, availableGross } = payoutSummary(state, orgId);
  if (available.length === 0) throw new Error('There is nothing to pay out yet.');
  const fee = Math.round(availableGross * PLATFORM_FEE_RATE);
  return db.insert('payouts', {
    id: uid('pay'),
    orgId,
    eventIds: available.map((e) => e.id),
    gross: availableGross,
    fee,
    net: availableGross - fee,
    status: 'processing',
    createdAt: new Date().toISOString(),
  });
}
