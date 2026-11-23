import Icon from '../common/Icon.jsx';
import { coverStyle } from '../common/EventThumb.jsx';
import { themeFor } from '../../data/artwork.js';
import { cityOf } from '../../hooks/useHomeEvents.js';
import { eventCapacity, eventSold, minPrice } from '../../models/index.js';
import { formatShortDate, formatTime } from '../../utils/format.js';

/** Portrait event card with cover, heart, title, date, price and spots left. */
export default function EventCard({ event, saved, onToggleSave, onOpen }) {
  const left = eventCapacity(event) - eventSold(event);
  const price = minPrice(event);
  return (
    <article className="ev-card" style={coverStyle(event)} onClick={() => onOpen(event)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(event)}>
      {!event.coverImage && <span className="ev-card-emoji">{themeFor(event.category).emoji}</span>}
      <button
        type="button"
        className={`heart-btn ${saved ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(event.id);
        }}
        aria-label={saved ? 'Remove from saved' : 'Save event'}
        aria-pressed={saved}
      >
        <Icon name="heart" size={13} filled={saved} />
      </button>
      <div className="ev-card-body">
        <h3>{event.title}</h3>
        <p>
          {formatShortDate(event.date)} · {formatTime(event.startTime)} · {cityOf(event.venue)}
        </p>
        <div className="ev-card-foot">
          <span className="price-pill">{price === 0 ? 'Free' : `${price} TND`}</span>
          <span className="ev-left">{left <= 0 ? 'Sold out' : `${left} spots left`}</span>
          <span className="ticket-btn" aria-hidden="true">
            <Icon name="ticketPlain" size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}
