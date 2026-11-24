import Icon from "../common/Icon";

/**
 * StatusTimeline — the 3 lines of "Application under review".
 * items: [{ label, note, state: 'done' | 'current' | 'todo' }]
 */
function StatusTimeline({ items }) {
  return (
    <ol className="status-timeline">
      {items.map((item, i) => (
        <li key={item.label} className={`status-item ${item.state}`}>
          <span className="status-dot">
            {item.state === "done" ? <Icon name="check" size={13} strokeWidth={2.6} /> : i + 1}
          </span>
          <span className="status-label">{item.label}</span>
          {item.note && <span className="status-note">· {item.note}</span>}
        </li>
      ))}
    </ol>
  );
}

export default StatusTimeline;
