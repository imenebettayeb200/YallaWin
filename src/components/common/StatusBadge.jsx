import { statusLabels } from "../../utils";

/* StatusBadge — coloured dot + label (On sale, Sold out, Draft, Ended...). */
function StatusBadge({ status, label }) {
  return (
    <span className={"status-badge status-" + status}>
      <span className="status-dot"></span>
      {label || statusLabels[status] || status}
    </span>
  );
}

export default StatusBadge;
