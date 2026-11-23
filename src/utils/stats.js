import { addDays, startOfDay, toISODate } from './dates.js';

/**
 * Tickets per day for the last `days` days (oldest first).
 * endOffset shifts the window back (e.g. days=30, endOffset=30 -> the previous 30 days).
 */
export function dailyTotals(sales, days, endOffset = 0) {
  const today = startOfDay(new Date());
  const byDate = new Map();
  sales.forEach((s) => byDate.set(s.date, (byDate.get(s.date) || 0) + s.qty));
  const result = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = addDays(today, -(i + endOffset));
    result.push({ date: d, value: byDate.get(toISODate(d)) || 0 });
  }
  return result;
}

export function sumValues(series) {
  return series.reduce((s, d) => s + d.value, 0);
}
