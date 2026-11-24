import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import EventThumb from "../common/EventThumb";
import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";
import {
  eventCapacity,
  eventRevenue,
  eventSold,
  eventStatus,
  formatShortDate,
  formatTime,
  formatTND,
  isFreeEvent,
} from "../../utils";

/** One row: thumbnail + name | date | sold bar | revenue | status | › */
function EventRow({ event, orgName, linkPrefix }) {
  const status = eventStatus(event);
  const sold = eventSold(event);
  const capacity = eventCapacity(event);
  const past = status === "ended";

  let revenue = formatTND(eventRevenue(event));
  if (status === "draft") revenue = "—";
  else if (isFreeEvent(event)) revenue = "Free";

  return (
    <Link to={linkPrefix + event.id} className={`event-row ${past ? "is-past" : ""}`} role="row">
      <span className="event-cell-main" role="cell">
        <EventThumb event={event} size={38} />
        <span>
          <span className="event-name">{event.title}</span>
          <span className="event-meta">
            {event.category}
            {orgName ? ` · ${orgName}` : ""}
          </span>
        </span>
      </span>
      <span className="event-date" role="cell">
        {event.date ? `${formatShortDate(event.date, past)}${past ? "" : ` · ${formatTime(event.startTime)}`}` : "—"}
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
    </Link>
  );
}

export default EventRow;
