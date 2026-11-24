import { useEffect } from "react";
import {
  dailyTotals,
  eventRevenue,
  eventStart,
  formatLongDate,
  isUpcoming,
  monthName,
  percentChange,
  sumValues,
  todayIso,
} from "../../utils";
import PageHeader from "../../components/layout/PageHeader";
import KpiGrid from "../../components/dashboard/KpiGrid";
import TicketSalesChart from "../../components/dashboard/TicketSalesChart";
import RevenueByEvent from "../../components/dashboard/RevenueByEvent";
import UpcomingEventsPanel from "../../components/dashboard/UpcomingEventsPanel";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/* Overview — /org. Home of the dashboard: 4 numbers, the sales chart, revenue by event and the next events. */
function Overview({ organization, events, tickets, reviews, notifications }) {
  useEffect(() => {
    document.title = "Overview · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  const orgEvents = events.filter((e) => e.orgId === organization.id);
  const orgEventIds = orgEvents.map((e) => e.id);
  const sales = tickets.filter((t) => orgEventIds.includes(t.eventId) && t.status === "confirmed");
  const orgReviews = reviews.filter((r) => orgEventIds.includes(r.eventId));

  /* Revenue of this month vs. the same days of last month. */
  const today = new Date();
  const thisMonth = todayIso().slice(0, 7);
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonth = lastMonthDate.getFullYear() + "-" + String(lastMonthDate.getMonth() + 1).padStart(2, "0");
  const revenueMonth = sales.filter((s) => s.date.startsWith(thisMonth)).reduce((sum, s) => sum + s.price * s.qty, 0);
  const revenuePrev = sales
    .filter((s) => s.date.startsWith(lastMonth) && Number(s.date.slice(8, 10)) <= today.getDate())
    .reduce((sum, s) => sum + s.price * s.qty, 0);

  /* Tickets: last 30 days vs. the 30 days before. */
  const last30 = sumValues(dailyTotals(sales, 30, 0));
  const prev30 = sumValues(dailyTotals(sales, 30, 30));

  const upcoming = orgEvents.filter(isUpcoming).sort((a, b) => eventStart(a) - eventStart(b));
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const thisWeek = upcoming.filter((e) => eventStart(e) < weekEnd).length;

  /* Revenue by event: the 3 best upcoming events + "Other events". */
  const byRevenue = [...upcoming].sort((a, b) => eventRevenue(b) - eventRevenue(a));
  const revenueRows = byRevenue.slice(0, 3).map((e) => ({ id: e.id, label: e.title, value: eventRevenue(e) }));
  if (byRevenue.length > 3) {
    const others = byRevenue.slice(3).reduce((sum, e) => sum + eventRevenue(e), 0);
    revenueRows.push({ id: "others", label: "Other events", value: others });
  }

  const kpis = {
    monthLabel: monthName(today.getMonth()),
    revenueMonth: revenueMonth,
    revenueChange: percentChange(revenueMonth, revenuePrev),
    prevMonthName: monthName(lastMonthDate.getMonth(), true),
    tickets: last30,
    ticketsChange: percentChange(last30, prev30),
    upcomingCount: upcoming.length,
    thisWeek: thisWeek,
    avgRating: orgReviews.length ? orgReviews.reduce((sum, r) => sum + r.rating, 0) / orgReviews.length : 0,
    reviewCount: orgReviews.length,
  };

  return (
    <div className="page">
      <PageHeader
        title={greeting() + ", " + organization.name}
        subtitle={formatLongDate(todayIso()) + " · Here's how your events are doing."}
        notifications={notifications}
        showCreate
      ></PageHeader>
      <KpiGrid kpis={kpis}></KpiGrid>
      <div className="overview-grid">
        <TicketSalesChart sales={sales}></TicketSalesChart>
        <RevenueByEvent rows={revenueRows}></RevenueByEvent>
      </div>
      <UpcomingEventsPanel events={upcoming} orgName={organization.name}></UpcomingEventsPanel>
    </div>
  );
}

export default Overview;
