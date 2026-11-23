import Icon from '../common/Icon.jsx';

/** Small stat card: label + icon, big value, footer (usually a <Delta />). */
export default function KpiCard({ label, icon, value, footer }) {
  return (
    <div className="panel kpi">
      <div className="kpi-head">
        <span>{label}</span>
        <Icon name={icon} size={16} />
      </div>
      <p className="kpi-value">{value}</p>
      {footer}
    </div>
  );
}
