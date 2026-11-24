import { useMemo } from 'react';
import { useDbState } from '../data/useDb.js';
import { eventCapacity, eventSold, eventStart, eventStatus, isUpcoming, minPrice } from '../models/index.js';

export function cityOf(venue = '') {
  const parts = venue.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

const SORTERS = {
  soon: (a, b) => eventStart(a) - eventStart(b),
  popular: (a, b) => eventSold(b) - eventSold(a),
  'price-asc': (a, b) => minPrice(a) - minPrice(b),
  'price-desc': (a, b) => minPrice(b) - minPrice(a),
};

/** Data for the public home page: top picks, filtered list, cities, and the user's tickets. */
export default function useHomeEvents({ search, category, freeOnly, city, sort, userId, now = new Date() }) {
  const state = useDbState();
  const tick = now.getTime();

  const orgNames = useMemo(() => Object.fromEntries(state.organizations.map((o) => [o.id, o.name])), [state.organizations]);

  const upcoming = useMemo(() => {
    return state.events.filter((e) => e.status === 'published' && isUpcoming(e, now));
  }, [state.events, tick]);

  const topPicks = useMemo(
    () =>
      upcoming
        .filter((e) => eventStatus(e) !== 'sold_out')
        .sort((a, b) => eventSold(b) / eventCapacity(b) - eventSold(a) / eventCapacity(a))
        .slice(0, 5),
    [upcoming],
  );

  const cities = useMemo(() => {
    const set = new Set(upcoming.map((e) => cityOf(e.venue)).filter(Boolean));
    return [{ key: 'all', label: 'All cities' }, ...[...set].sort().map((c) => ({ key: c, label: c }))];
  }, [upcoming]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return upcoming
      .filter((e) => {
        if (category !== 'all' && e.category !== category) return false;
        if (freeOnly && minPrice(e) !== 0) return false;
        if (city !== 'all' && cityOf(e.venue) !== city) return false;
        return !q || `${e.title} ${e.venue} ${e.category} ${orgNames[e.orgId] || ''}`.toLowerCase().includes(q);
      })
      .sort(SORTERS[sort]);
  }, [upcoming, search, category, freeOnly, city, sort, orgNames]);

  const tickets = useMemo(() => {
    if (!userId) return { goingTo: [], attended: [] };
    const byEvent = {};
    state.sales
      .filter((s) => s.userId === userId)
      .forEach((s) => {
        byEvent[s.eventId] = (byEvent[s.eventId] || 0) + s.qty;
      });
    const list = Object.entries(byEvent)
      .map(([eventId, qty]) => ({ event: state.events.find((e) => e.id === eventId), qty }))
      .filter((t) => t.event);
    return {
      goingTo: list.filter((t) => eventStatus(t.event) !== 'ended').sort((a, b) => eventStart(a.event) - eventStart(b.event)),
      attended: list.filter((t) => eventStatus(t.event) === 'ended'),
    };
  }, [state.sales, state.events, userId]);

  const myReviews = useMemo(() => {
    const map = {};
    if (userId) state.reviews.filter((r) => r.userId === userId).forEach((r) => {
      map[r.eventId] = r;
    });
    return map;
  }, [state.reviews, userId]);

  return { orgNames, topPicks, cities, filtered, tickets, myReviews, onSaleCount: upcoming.length, allEvents: state.events };
}
