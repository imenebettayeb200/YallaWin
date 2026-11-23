import { useMemo } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Icon from '../../components/common/Icon.jsx';
import KpiCard from '../../components/dashboard/KpiCard.jsx';
import PayoutMethodCard from '../../components/payouts/PayoutMethodCard.jsx';
import PayoutHistory from '../../components/payouts/PayoutHistory.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDbState } from '../../data/useDb.js';
import { PLATFORM_FEE_RATE } from '../../models/index.js';
import { payoutSummary, requestPayout } from '../../services/eventService.js';
import { formatTND } from '../../utils/format.js';

export default function Payouts() {
  const { organization } = useAuth();
  const state = useDbState();
  const toast = useToast();
  const summary = useMemo(() => payoutSummary(state, organization.id), [state, organization.id]);
  const eventsById = useMemo(() => Object.fromEntries(state.events.map((e) => [e.id, e])), [state.events]);

  const handleRequest = () => {
    try {
      toast.show(`Payout of ${formatTND(requestPayout(organization.id).net)} requested.`);
    } catch (err) {
      toast.show(err.message, 'error');
    }
  };

  return (
    <div className="page">
      <PageHeader title="Payouts" subtitle={`Revenue from ended events, minus a ${PLATFORM_FEE_RATE * 100}% platform fee`}>
        <button type="button" className="btn btn-gradient" onClick={handleRequest} disabled={summary.available.length === 0}>
          Request payout <Icon name="arrowRight" size={16} />
        </button>
      </PageHeader>

      <div className="kpi-grid kpi-grid-3">
        <KpiCard
          label="Available"
          icon="wallet"
          value={formatTND(summary.availableNet)}
          footer={<span className="muted small">{summary.available.length} ended event(s) not paid out yet</span>}
        />
        <KpiCard label="Upcoming (pending)" icon="calendar" value={formatTND(summary.pendingGross)} footer={<span className="muted small">Released after each event ends</span>} />
        <KpiCard
          label="Paid out"
          icon="check"
          value={formatTND(summary.paidTotal)}
          footer={<span className="muted small">{summary.processingTotal > 0 ? `${formatTND(summary.processingTotal)} processing` : 'All time'}</span>}
        />
      </div>

      <PayoutMethodCard payoutMethod={organization.payoutMethod} />
      <PayoutHistory payouts={summary.payouts} eventsById={eventsById} />
    </div>
  );
}
