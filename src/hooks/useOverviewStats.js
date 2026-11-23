import { useMemo } from 'react';
import { useDbState } from '../data/useDb.js';
import { eventRevenue, eventStart, isUpcoming } from '../models/index.js';
import { addDays, startOfDay, toISODate } from '../utils/dates.js';
import { MONTHS, MONTHS_LONG, percentChange } from '../utils/format.js';
import { dailyTotals, sumValues } from '../utils/stats.js';

/** Everything the Overview page shows, computed from the database. */
export default function useOverviewStats(orgId) {
  const state = useDbState();

  return useMemo(() => {
    const now = new Date();
    const events = state.events.filter((e) => e.orgId === orgId);
    const sales = state.sales.filter((s) => s.orgId === orgId);
    const reviews = state.reviews.filter((r) => r.orgId === orgId);

    // Revenue this month vs. the same days of last month
    const monthKey = toISODate(now).slice(0, 7);
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthKey = toISODate(prevMonthDate).slice(0, 7);
    const revenueMonth = sales.filter((s) => s.date.startsWith(monthKey)).reduce((a, s) => a + s.amount, 0);
    const revenuePrev = sales
      .filter((s) => s.date.startsWith(prevMonthKey) && Number(s.date.slice(8, 10)) <= now.getDate())
      .reduce((a, s) => a + s.amount, 0);

    // Tickets: last 30 days vs. the previous 30
    const last30 = sumValues(dailyTotals(sales, 30));
    const prev30 = sumValues(dailyTotals(sales, 30, 30));

    // Upcoming events
    const upcoming = events.filter((e) => isUpcoming(e, now)).sort((a, b) => eventStart(a) - eventStart(b));
    const weekEnd = addDays(startOfDay(now), 7);
    const thisWeek = upcoming.filter((e) => eventStart(e) < weekEnd).length;

    // Revenue by event: top 3 upcoming + "Other events"
    const byRevenue = [...upcoming].sort((a, b) => eventRevenue(b) - eventRevenue(a));
    const top = byRevenue.slice(0, 3).map((e) => ({ id: e.id, label: e.title, value: eventRevenue(e) }));
    const others = byRevenue.slice(3).reduce((a, e) => a + eventRevenue(e), 0);
    const revenueRows = byRevenue.length > 3 ? [...top, { id: 'others', label: 'Other events', value: others }] : top;

    return {
      sales,
      upcoming,
      revenueRows,
      kpis: {
        monthLabel: MONTHS[now.getMonth()],
        revenueMonth,
        revenueChange: percentChange(revenueMonth, revenuePrev),
        prevMonthName: MONTHS_LONG[prevMonthDate.getMonth()],
        tickets: last30,
        ticketsChange: percentChange(last30, prev30),
        upcomingCount: upcoming.length,
        thisWeek,
        avgRating: reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0,
        reviewCount: reviews.length,
      },
    };
  }, [state, orgId]);
}
