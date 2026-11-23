import Panel from '../common/Panel.jsx';
import { formatTND } from '../../utils/format.js';

const COLORS = ['linear-gradient(90deg,#ff2e7e,#ff2e9a)', '#3d6bff', '#ff9a1f', 'linear-gradient(90deg,#9b2cff,#d02cff)'];

function RevenueRow({ label, value, max, color }) {
  return (
    <li>
      <div className="revenue-row">
        <span>{label}</span>
        <span>{formatTND(value)}</span>
      </div>
      <div className="revenue-track">
        <div className="revenue-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </li>
  );
}

export default function RevenueByEvent({ rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <Panel className="revenue-panel">
      <h2 className="panel-title">Revenue by event</h2>
      {rows.length === 0 ? (
        <p className="muted small">No upcoming events yet.</p>
      ) : (
        <ul className="revenue-list">
          {rows.map((row, i) => (
            <RevenueRow key={row.id} label={row.label} value={row.value} max={max} color={COLORS[i % COLORS.length]} />
          ))}
        </ul>
      )}
    </Panel>
  );
}
