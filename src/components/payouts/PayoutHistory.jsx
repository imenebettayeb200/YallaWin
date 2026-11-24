import Panel from "../common/Panel";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatShortDate, formatTND } from "../../utils";

function PayoutRow({ payout, events }) {
  const names = payout.eventIds
    .map((id) => (events.find((e) => e.id === id) ? events.find((e) => e.id === id).title : "Deleted event"))
    .join(", ");
  const paid = payout.status === "paid";
  return (
    <div className="simple-row">
      <span>{formatShortDate(payout.date, true)}</span>
      <span className="ellipsis">{names}</span>
      <span>{formatTND(payout.gross)}</span>
      <span className="muted">−{formatTND(payout.fee)}</span>
      <span className="strong">{formatTND(payout.net)}</span>
      <span>
        <StatusBadge status={paid ? "on_sale" : "almost_full"} label={paid ? "Paid" : "Processing"} />
      </span>
    </div>
  );
}

function PayoutHistory({ payouts, events }) {
  return (
    <Panel className="table-panel">
      <h2 className="panel-title">History</h2>
      {payouts.length === 0 ? (
        <EmptyState
          icon="payouts"
          title="No payouts yet"
          text="When your events end, their revenue becomes available here."
        />
      ) : (
        <div className="simple-table">
          <div className="simple-row simple-head">
            {["Date", "Events", "Gross", "Fee", "Net", "Status"].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {payouts.map((p) => (
            <PayoutRow key={p.id} payout={p} events={events} />
          ))}
        </div>
      )}
    </Panel>
  );
}

export default PayoutHistory;
