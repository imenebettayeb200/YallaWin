import PageHeader from '../../components/layout/PageHeader.jsx';
import KpiGrid from '../../components/dashboard/KpiGrid.jsx';
import TicketSalesChart from '../../components/dashboard/TicketSalesChart.jsx';
import RevenueByEvent from '../../components/dashboard/RevenueByEvent.jsx';
import UpcomingEventsPanel from '../../components/dashboard/UpcomingEventsPanel.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useOverviewStats from '../../hooks/useOverviewStats.js';
import { formatLongToday } from '../../utils/format.js';

function greeting(date) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Overview() {
  const { organization } = useAuth();
  const { kpis, sales, revenueRows, upcoming } = useOverviewStats(organization.id);
  const now = new Date();

  return (
    <div className="page">
      <PageHeader
        title={`${greeting(now)}, ${organization.name}`}
        pageTitle="Overview"
        subtitle={`${formatLongToday(now)} · Here's how your events are doing.`}
        showCreate
      />
      <KpiGrid kpis={kpis} />
      <div className="overview-grid">
        <TicketSalesChart sales={sales} />
        <RevenueByEvent rows={revenueRows} />
      </div>
      <UpcomingEventsPanel events={upcoming} orgName={organization.name} />
    </div>
  );
}