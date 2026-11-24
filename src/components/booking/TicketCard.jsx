import { formatShortDate, formatTime } from "../../utils";
import Icon from "../common/Icon";
import QrCode from "../common/QrCode";

/* TicketCard — "YOUR TICKET #YW-4807 · 2 guests" with the event, date, venue and the QR code. */
function TicketCard({ ticket, event }) {
  return (
    <div className={ticket.status === "cancelled" ? "ticket-card cancelled" : "ticket-card"}>
      <div className="ticket-card-info">
        <p className="ticket-label">YOUR TICKET</p>
        <p className="ticket-number">
          #{ticket.id} · {ticket.qty} {ticket.qty > 1 ? "guests" : "guest"}
        </p>
        <h3>{event.title}</h3>
        <p className="muted small">
          <Icon name="calendar" size={13}></Icon> {formatShortDate(event.date)} · {formatTime(event.startTime)}
        </p>
        <p className="muted small">
          <Icon name="pin" size={13}></Icon> {event.venue}
        </p>
        {ticket.status === "cancelled" && <p className="text-red small">Cancelled</p>}
      </div>
      <div className="ticket-card-qr">
        <QrCode value={ticket.id} size={120}></QrCode>
        <p className="muted small">Show this QR code at the entrance.</p>
      </div>
    </div>
  );
}

export default TicketCard;
