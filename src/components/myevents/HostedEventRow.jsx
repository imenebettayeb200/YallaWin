import { Link } from "react-router-dom";
import { eventCapacity, eventSold, eventStatus, formatShortDate, formatTime } from "../../utils";
import EventThumb from "../common/EventThumb";
import ProgressBar from "../common/ProgressBar";
import StatusBadge from "../common/StatusBadge";

/* HostedEventRow — one event the user hosts: picture, title, date, tickets sold, status and "Manage". */
function HostedEventRow({ event }) {
  const sold = eventSold(event);
  const capacity = eventCapacity(event);
  return (
    <div className="hosted-row panel">
      <EventThumb event={event} size={56}></EventThumb>
      <div className="booking-info">
        <span className="ticket-title">{event.title || "Untitled event"}</span>
        <span className="ticket-meta">
          {event.date ? formatShortDate(event.date, true) + " · " + formatTime(event.startTime) : "No date yet"}
        </span>
      </div>
      <div className="hosted-sold">
        <span className="small">
          {sold} / {capacity} sold
        </span>
        <ProgressBar value={sold} max={capacity}></ProgressBar>
      </div>
      <StatusBadge status={eventStatus(event)}></StatusBadge>
      <div className="hosted-actions">
        {event.status === "published" && (
          <Link to={"/event/" + event.id} className="btn btn-outline btn-sm">
            View
          </Link>
        )}
        <Link to={"/my-events/" + event.id} className="btn btn-white btn-sm">
          {event.status === "draft" ? "Continue editing" : "Manage"}
        </Link>
      </div>
    </div>
  );
}

export default HostedEventRow;
