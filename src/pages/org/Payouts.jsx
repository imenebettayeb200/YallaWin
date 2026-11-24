import { useEffect } from "react";
import { platformFeeRate } from "../../Data";
import { eventRevenue, eventStatus, formatTND } from "../../utils";
import PageHeader from "../../components/layout/PageHeader";
import Icon from "../../components/common/Icon";
import KpiCard from "../../components/dashboard/KpiCard";
import PayoutMethodCard from "../../components/payouts/PayoutMethodCard";
import PayoutHistory from "../../components/payouts/PayoutHistory";

/*
 * Payouts — /org/payouts. Money of ended events that was not paid out yet (minus the 5% fee),
 * money of upcoming events, and the history of payouts.
 */
function Payouts({ organization, events, payouts, notifications, onRequestPayout, showToast }) {
  useEffect(() => {
    document.title = "Payouts · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  const orgPayouts = payouts.filter((p) => p.orgId === organization.id).sort((a, b) => b.date.localeCompare(a.date));
  const paidEventIds = [];
  orgPayouts.forEach((p) => paidEventIds.push(...p.eventIds));

  const orgEvents = events.filter((e) => e.orgId === organization.id && e.status === "published");
  const available = orgEvents.filter(
    (e) => eventStatus(e) === "ended" && eventRevenue(e) > 0 && !paidEventIds.includes(e.id),
  );
  const availableGross = available.reduce((sum, e) => sum + eventRevenue(e), 0);
  const availableNet = Math.round(availableGross * (1 - platformFeeRate));
  const pendingGross = orgEvents.filter((e) => eventStatus(e) !== "ended").reduce((sum, e) => sum + eventRevenue(e), 0);
  const paidTotal = orgPayouts.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.net, 0);
  const processingTotal = orgPayouts.filter((p) => p.status === "processing").reduce((sum, p) => sum + p.net, 0);
  const hasBank = organization.bank.name.trim() !== "";

  const handleRequest = () => {
    if (!hasBank) {
      showToast("Add your bank details in Settings first.", "error");
      return;
    }
    onRequestPayout(
      organization.id,
      available.map((e) => e.id),
      availableGross,
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="Payouts"
        subtitle={"Revenue from ended events, minus a " + platformFeeRate * 100 + "% platform fee"}
        notifications={notifications}
      >
        <button type="button" className="btn btn-gradient" onClick={handleRequest} disabled={available.length === 0}>
          Request payout <Icon name="arrowRight" size={16}></Icon>
        </button>
      </PageHeader>
      <div className="kpi-grid kpi-grid-3">
        <KpiCard
          label="Available"
          icon="wallet"
          value={formatTND(availableNet)}
          footer={<span className="muted small">{available.length} ended event(s) not paid out yet</span>}
        ></KpiCard>
        <KpiCard
          label="Upcoming (pending)"
          icon="calendar"
          value={formatTND(pendingGross)}
          footer={<span className="muted small">Released after each event ends</span>}
        ></KpiCard>
        <KpiCard
          label="Paid out"
          icon="check"
          value={formatTND(paidTotal)}
          footer={
            <span className="muted small">
              {processingTotal > 0 ? formatTND(processingTotal) + " processing" : "All time"}
            </span>
          }
        ></KpiCard>
      </div>
      <PayoutMethodCard bank={organization.bank}></PayoutMethodCard>
      <PayoutHistory payouts={orgPayouts} events={events}></PayoutHistory>
    </div>
  );
}

export default Payouts;
