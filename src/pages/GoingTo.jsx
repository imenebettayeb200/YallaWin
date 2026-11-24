import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { goingTabs } from "../Data";
import { eventStart, isPast } from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import PillTabs from "../components/common/PillTabs";
import EmptyState from "../components/common/EmptyState";
import NextUpCard from "../components/going/NextUpCard";
import BookingRow from "../components/going/BookingRow";
import ReviewPrompt from "../components/going/ReviewPrompt";
import EventGrid from "../components/home/EventGrid";
import WriteReviewModal from "../components/reviews/WriteReviewModal";

/*
 * GoingTo — /going. "All your Events": tabs All / Upcoming / Past / Liked,
 * the "Next up" card with the QR ticket, the other bookings, and a "How was it?" banner.
 */
function GoingTo({ user, events, tickets, reviews, onLogout, onToggleLike, onCancelBooking, onAddReview }) {
  const [tab, setTab] = useState("all");
  const [reviewEvent, setReviewEvent] = useState(null);

  useEffect(() => {
    document.title = "Going to · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  if (!user) return <Navigate to="/login" replace></Navigate>;

  /* The user's bookings, each with its event. */
  const myBookings = tickets
    .filter((t) => t.userId === user.id)
    .map((t) => ({ ticket: t, event: events.find((e) => e.id === t.eventId) }))
    .filter((b) => b.event);

  const upcoming = myBookings
    .filter((b) => b.ticket.status === "confirmed" && !isPast(b.event))
    .sort((a, b) => eventStart(a.event) - eventStart(b.event));
  const past = myBookings
    .filter((b) => isPast(b.event) || b.ticket.status === "cancelled")
    .sort((a, b) => eventStart(b.event) - eventStart(a.event));
  const liked = events.filter((e) => user.likes.includes(e.id) && e.status === "published");

  const myReview = (eventId) => reviews.find((r) => r.userId === user.id && r.eventId === eventId);
  const toReview = past.find((b) => b.ticket.status === "confirmed" && !myReview(b.event.id));

  const counts = {
    all: upcoming.length + past.length,
    upcoming: upcoming.length,
    past: past.length,
    liked: liked.length,
  };
  const nextUp = upcoming[0];
  const later = upcoming.slice(1);

  const cancel = (ticket) => {
    if (window.confirm("Cancel your booking #" + ticket.id + "? You will be refunded.")) onCancelBooking(ticket.id);
  };

  const rows = (list) =>
    list.map((b) => (
      <BookingRow
        key={b.ticket.id}
        ticket={b.ticket}
        event={b.event}
        review={myReview(b.event.id)}
        onReview={setReviewEvent}
      ></BookingRow>
    ));

  const browse = (
    <Link to="/" className="btn btn-white">
      Browse events
    </Link>
  );

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>

      <main className="going-page">
        <h1 className="big-title">
          All your <em>Events</em>
        </h1>
        <PillTabs tabs={goingTabs} value={tab} counts={counts} onChange={setTab}></PillTabs>

        {(tab === "all" || tab === "upcoming") && (
          <>
            {nextUp ? (
              <NextUpCard ticket={nextUp.ticket} event={nextUp.event} onCancel={cancel}></NextUpCard>
            ) : (
              <EmptyState
                icon="ticketPlain"
                title="No upcoming tickets"
                text="Find something fun on the home page."
                action={browse}
              ></EmptyState>
            )}
            {later.length > 0 && (
              <>
                <p className="list-label">COMING UP NEXT</p>
                <div className="booking-list">{rows(later)}</div>
              </>
            )}
          </>
        )}

        {tab === "all" && toReview && <ReviewPrompt event={toReview.event} onReview={setReviewEvent}></ReviewPrompt>}

        {(tab === "all" || tab === "past") && past.length > 0 && (
          <>
            <p className="list-label">PAST EVENTS</p>
            <div className="booking-list">{rows(past)}</div>
          </>
        )}
        {tab === "past" && past.length === 0 && (
          <EmptyState
            icon="calendar"
            title="No past events yet"
            text="Events you attended will appear here so you can review them."
          ></EmptyState>
        )}

        {tab === "liked" && (
          <EventGrid
            events={liked}
            likes={user.likes}
            onToggleLike={onToggleLike}
            emptyTitle="No liked events"
            emptyText="Tap the heart on any event to keep it here."
          ></EventGrid>
        )}
      </main>

      {reviewEvent && (
        <WriteReviewModal
          event={reviewEvent}
          onClose={() => setReviewEvent(null)}
          onSubmit={(rating, tags, text) => onAddReview(reviewEvent.id, rating, tags, text)}
        ></WriteReviewModal>
      )}
    </div>
  );
}

export default GoingTo;
