import { useMemo } from 'react';
import { useDbState } from '../data/useDb.js';
import { eventStart, eventStatus } from '../models/index.js';
import { EVENT_TABS } from '../data/data.js';

export { EVENT_TABS };

function tabOf(event, now) {
  const s = eventStatus(event, now);
  if (s === 'draft') return 'drafts';
  if (s === 'ended') return 'past';
  return 'upcoming';
}

/** Organization events filtered by tab + search, with counters for each tab. */
export default function useOrgEventList(orgId, tab, query) {
  const state = useDbState();

  const { sorted, counts } = useMemo(() => {
    const now = new Date();
    const rank = { upcoming: 0, drafts: 1, past: 2 };
    const list = state.events
      .filter((e) => e.orgId === orgId)
      .map((e) => ({ e, t: tabOf(e, now), start: eventStart(e) }))
      .sort((a, b) => {
        if (rank[a.t] !== rank[b.t]) return rank[a.t] - rank[b.t];
        const at = a.start ? a.start.getTime() : Infinity;
        const bt = b.start ? b.start.getTime() : Infinity;
        return a.t === 'past' ? bt - at : at - bt;
      });
    const c = { all: list.length, upcoming: 0, drafts: 0, past: 0 };
    list.forEach((x) => {
      c[x.t] += 1;
    });
    return { sorted: list, counts: c };
  }, [state.events, orgId]);

  const events = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted
      .filter((x) => tab === 'all' || x.t === tab)
      .filter((x) => !q || `${x.e.title} ${x.e.category} ${x.e.venue}`.toLowerCase().includes(q))
      .map((x) => x.e);
  }, [sorted, tab, query]);

  return { events, counts };
}