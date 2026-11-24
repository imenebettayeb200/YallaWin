import { Link } from "react-router-dom";
import {
  cityOf,
  coverStyle,
  directionsUrl,
  eventStart,
  formatCountdown,
  formatShortDate,
  formatTime,
} from "../../utils";
import Icon from "../common/Icon";
import TicketCard from "../booking/TicketCard";

/*
 * NextUpCard — the big card of "Going To" for the next event:
 * cover, "Next up · in 4 days", location, Directions, Cancel booking, View ticket + the QR ticket.
 * Cancelling is free until 24h before the event.
 */
function NextUpCard({ ticket, event, onCancel }) {
  const hoursLeft = (eventStart(event).getTime() - Date.now()) / 3600000;
  const canCancel = hoursLeft > 24;

  return (
    <section className="next-up panel">
      <div className="next-up-main">
        <div className="next-up-cover" style={coverStyle(event)}></div>
        <div className="next-up-info">
          <p className="next-up-label">Next up · {formatCountdown(eventStart(event))}</p>
          <h2>{event.title}</h2>
          <p className="muted">
            {formatShortDate(event.date)} · {formatTime(event.startTime)}
          </p>
          <span className="filter-pill">
            <Icon name="pin" size={13}></Icon> {event.venue}, {cityOf(event.address)}
          </span>
          <div className="next-up-actions">
            <a href={directionsUrl(event)} target="_blank" rel="noreferrer" className="btn btn-white btn-sm">
              <Icon name="pin" size={14}></Icon> Directions
            </a>
            <Link to={"/ticket/" + ticket.id} className="btn btn-outline btn-sm">
              <Icon name="qr" size={14}></Icon> View ticket
            </Link>
            <button
              type="button"
              className="btn btn-outline btn-danger btn-sm"
              onClick={() => onCancel(ticket)}
              disabled={!canCancel}
              title={canCancel ? "" : "Free cancellation ends 24h before the event"}
            >
              Cancel booking
            </button>
          </div>
        </div>
      </div>
      <TicketCard ticket={ticket} event={event}></TicketCard>
    </section>
  );
}

export default NextUpCard;
