import KpiCard from './KpiCard.jsx';
import Delta from '../common/Delta.jsx';
import { formatNumber, formatTND } from '../../utils/format.js';

/** The 4 stat cards at the top of the Overview. */
export default function KpiGrid({ kpis }) {
  return (
    <div className="kpi-grid">
      <KpiCard
        label={`Revenue · ${kpis.monthLabel}`}
        icon="wallet"
        value={formatTND(kpis.revenueMonth)}
        footer={<Delta value={kpis.revenueChange} suffix={`vs ${kpis.prevMonthName}`} />}
      />
      <KpiCard
        label="Tickets sold"
        icon="ticketPlain"
        value={formatNumber(kpis.tickets)}
        footer={<Delta value={kpis.ticketsChange} suffix="vs prev. 30 days" />}
      />
      <KpiCard label="Upcoming events" icon="calendar" value={kpis.upcomingCount} footer={<Delta value={`${kpis.thisWeek} this week`} />} />
      <KpiCard
        label="Average rating"
        icon="star"
        value={kpis.reviewCount ? kpis.avgRating.toFixed(1) : '—'}
        footer={<Delta value={`${kpis.reviewCount} reviews`} />}
      />
    </div>
  );
}
