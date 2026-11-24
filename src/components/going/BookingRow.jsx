import { Link } from "react-router-dom";
import { formatShortDate, formatTime, formatTND, isPast } from "../../utils";
import EventThumb from "../common/EventThumb";
import Stars from "../common/Stars";
import StatusBadge from "../common/StatusBadge";

/*
 * BookingRow — one booking in "Going To": picture, title, date, number of tickets, price
 * and on the right: "View ticket", "Leave review", "Reviewed ★★★★★" or "Cancelled".
 */
function BookingRow({ ticket, event, review, onReview }) {
  const past = isPast(event) && ticket.status === "confirmed";
  let action = (
    <Link to={"/ticket/" + ticket.id} className="btn btn-outline btn-sm">
      View ticket
    </Link>
  );
  if (ticket.status === "cancelled") action = <StatusBadge status="ended" label="Cancelled"></StatusBadge>;
  else if (review) {
    action = (
      <span className="reviewed">
        <Stars rating={review.rating}></Stars> Reviewed
      </span>
    );
  } else if (past) {
    action = (
      <button type="button" className="btn btn-white btn-sm" onClick={() => onReview(event)}>
        Leave review
      </button>
    );
  }

  return (
    <div className="booking-row panel">
      <Link to={"/event/" + event.id}>
        <EventThumb event={event} size={64}></EventThumb>
      </Link>
      <div className="booking-info">
        <Link to={"/event/" + event.id} className="ticket-title">
          {event.title}
        </Link>
        <span className="ticket-meta">
          {formatShortDate(event.date, true)} · {formatTime(event.startTime)} · {event.venue}
        </span>
        <span className="ticket-meta">
          #{ticket.id} · {ticket.qty} ticket(s) · {ticket.total === 0 ? "Free" : formatTND(ticket.total)}
        </span>
      </div>
      <div className="booking-action">{action}</div>
    </div>
  );
}

export default BookingRow;
