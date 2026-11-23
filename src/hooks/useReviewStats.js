import { useMemo } from 'react';
import { useDbState } from '../data/useDb.js';
import { eventDisplayName } from '../models/index.js';

/** Reviews of an organization + rating distribution, tags and per-event averages. */
export default function useReviewStats(orgId) {
  const state = useDbState();

  return useMemo(() => {
    const reviews = state.reviews.filter((r) => r.orgId === orgId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const events = state.events.filter((e) => e.orgId === orgId);
    const eventsById = Object.fromEntries(events.map((e) => [e.id, e]));
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;

    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
    });
    const goAgain = total ? Math.floor((reviews.filter((r) => r.rating >= 3).length / total) * 100) : 0;

    const tagCounts = {};
    reviews.forEach((r) =>
      r.tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }),
    );
    const tags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));

    const perEvent = {};
    reviews.forEach((r) => {
      if (!perEvent[r.eventId]) perEvent[r.eventId] = { sum: 0, count: 0 };
      perEvent[r.eventId].sum += r.rating;
      perEvent[r.eventId].count += 1;
    });
    const reviewedEvents = Object.entries(perEvent)
      .filter(([id]) => eventsById[id])
      .map(([id, v]) => ({ id, name: eventDisplayName(eventsById[id], events), avg: v.sum / v.count, count: v.count }));
    const topEvents = [...reviewedEvents].sort((a, b) => b.count - a.count).slice(0, 3);

    return {
      reviews,
      events,
      eventsById,
      total,
      avg,
      distribution,
      goAgain,
      tags,
      topEvents,
      reviewedEvents: [...reviewedEvents].sort((a, b) => a.name.localeCompare(b.name)),
      counts: {
        all: total,
        'needs-reply': reviews.filter((r) => !r.reply).length,
        low: reviews.filter((r) => r.rating <= 2).length,
      },
    };
  }, [state.reviews, state.events, orgId]);
}
