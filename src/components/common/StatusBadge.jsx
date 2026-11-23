import { STATUS_LABELS } from '../../models/index.js';

/** status: on_sale | sold_out | almost_full | draft | ended (or any class suffix + custom label) */
export default function StatusBadge({ status, label }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-dot" />
      {label || STATUS_LABELS[status] || status}
    </span>
  );
}
