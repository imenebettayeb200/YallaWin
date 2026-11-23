import Icon from '../common/Icon.jsx';

export default function EventRatingCard({ name, avg, active, onClick }) {
  return (
    <button type="button" className={`event-rating ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="event-rating-name">{name}</span>
      <span className="event-rating-value">
        <Icon name="star" size={14} className="star-on" filled /> {avg.toFixed(1)}
      </span>
    </button>
  );
}
