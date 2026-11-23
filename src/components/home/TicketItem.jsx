import { coverStyle } from '../common/EventThumb.jsx';
import { formatShortDate, formatTimeLong } from '../../utils/format.js';

/** Row in "Going To": thumbnail, event info, quantity and ticket code. */
export default function TicketItem({ event, qty, onOpen }) {
  return (
    <button type="button" className="ticket-item" onClick={() => onOpen(event)}>
      <span className="ticket-thumb" style={coverStyle(event)} />
      <span className="ticket-info">
        <span className="ticket-title">{event.title}</span>
        <span className="ticket-meta">
          {formatShortDate(event.date, true)} · {formatTimeLong(event.startTime)} · {event.venue}
        </span>
      </span>
      <span className="ticket-qty">
        {qty} ticket{qty > 1 ? 's' : ''}
      </span>
      <span className="ticket-code" aria-label="Ticket code">
        YW-{event.id.slice(-4).toUpperCase()}
      </span>
    </button>
  );
}
