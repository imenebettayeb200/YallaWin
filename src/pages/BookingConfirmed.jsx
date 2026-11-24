import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { directionsUrl } from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Icon from "../components/common/Icon";
import TicketCard from "../components/booking/TicketCard";

/* BookingConfirmed — /ticket/:id. "You're going!" page with the ticket and its QR code (also used to view a ticket later). */
function BookingConfirmed({ user, events, tickets, onLogout }) {
  const { id } = useParams();

  useEffect(() => {
    document.title = "Your ticket · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  if (!user) return <Navigate to="/login" replace></Navigate>;
  const ticket = tickets.find((t) => t.id === id && t.userId === user.id);
  if (!ticket) return <Navigate to="/going" replace></Navigate>;
  const event = events.find((e) => e.id === ticket.eventId);

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>

      <main className="confirmed-page">
        <span className="confirmed-check">
          <Icon name="check" size={26} strokeWidth={2.6}></Icon>
        </span>
        <h1 className="confirmed-title">
          {ticket.status === "cancelled" ? "Booking cancelled" : "You're"}{" "}
          <em>{ticket.status === "cancelled" ? "" : "going!"}</em>
        </h1>
        <p className="muted center">
          {ticket.status === "cancelled"
            ? "This booking was cancelled and refunded."
            : "We sent your tickets to " + ticket.email + ". See you there!"}
        </p>

        <TicketCard ticket={ticket} event={event}></TicketCard>

        <div className="confirmed-actions">
          <Link to="/going" className="btn btn-white">
            <Icon name="ticketPlain" size={15}></Icon> My tickets
          </Link>
          <a href={directionsUrl(event)} target="_blank" rel="noreferrer" className="btn btn-outline">
            <Icon name="pin" size={15}></Icon> Directions
          </a>
          <Link to="/" className="btn btn-outline">
            Home
          </Link>
        </div>
      </main>
    </div>
  );
}

export default BookingConfirmed;
