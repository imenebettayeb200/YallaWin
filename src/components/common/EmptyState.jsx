import Icon from './Icon.jsx';

export default function EmptyState({ icon = 'calendar', title, text, action = null }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
