import Icon from '../common/Icon.jsx';
import EventThumb from '../common/EventThumb.jsx';
import ProgressBar from '../common/ProgressBar.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { eventCapacity, eventRevenue, eventSold, eventStatus, isFreeEvent } from '../../models/index.js';
import { formatShortDate, formatTime, formatTND } from '../../utils/format.js';

/** One row: thumbnail + name | date | sold bar | revenue | status | › */
export default function EventRow({ event, orgName, onOpen }) {
  const status = eventStatus(event);
  const sold = eventSold(event);
  const capacity = eventCapacity(event);
  const past = status === 'ended';
  const open = () => onOpen(event.id);

  let revenue = formatTND(eventRevenue(event));
  if (status === 'draft') revenue = '—';
  else if (isFreeEvent(event)) revenue = 'Free';

  return (
    <div className={`event-row ${past ? 'is-past' : ''}`} role="row" tabIndex={0} onClick={open} onKeyDown={(e) => e.key === 'Enter' && open()}>
      <span className="event-cell-main" role="cell">
        <EventThumb event={event} size={38} />
        <span>
          <span className="event-name">{event.title}</span>
          <span className="event-meta">
            {event.category}
            {orgName ? ` · ${orgName}` : ''}
          </span>
        </span>
      </span>
      <span className="event-date" role="cell">
        {event.date ? `${formatShortDate(event.date, past)}${past ? '' : ` · ${formatTime(event.startTime)}`}` : '—'}
      </span>
      <span className="event-sold" role="cell">
        <span>
          {sold} / {capacity}
        </span>
        <ProgressBar value={sold} max={capacity} />
      </span>
      <span className="event-revenue" role="cell">
        {revenue}
      </span>
      <span role="cell">
        <StatusBadge status={status} />
      </span>
      <span role="cell">
        <span className="round-btn" aria-label={`Open ${event.title}`}>
          <Icon name="chevronRight" size={14} />
        </span>
      </span>
    </div>
  );
}
