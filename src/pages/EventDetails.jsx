import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  coverStyle,
  eventStart,
  eventStatus,
  formatCountdown,
  formatLongDate,
  formatShortDate,
  formatTime,
  hostName,
  isPast,
  isUpcoming,
  minPrice,
  sameHost,
} from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Icon from "../components/common/Icon";
import EmptyState from "../components/common/EmptyState";
import HostCard from "../components/event/HostCard";
import BookBox from "../components/event/BookBox";
import LineupList from "../components/event/LineupList";
import LocationCard from "../components/event/LocationCard";
import PastReviews from "../components/event/PastReviews";
import MobileBookBar from "../components/event/MobileBookBar";
import EventGrid from "../components/home/EventGrid";
import WriteReviewModal from "../components/reviews/WriteReviewModal";

/*
 * EventDetails — /event/:id. Everything about one event: cover, date, host, price box,
 * about, lineup, location, reviews of past editions and "You might also like".
 */
function EventDetails({
  user,
  users,
  organizations,
  events,
  tickets,
  reviews,
  onLogout,
  onToggleLike,
  onAddReview,
  showToast,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [reviewOpen, setReviewOpen] = useState(false);
  const event = events.find((e) => e.id === id);

  /* New event opened: back to the top, 1 ticket, and update the tab title. */
  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    if (event) document.title = event.title + " · YallaWin";
  }, [id]);

  const isMine = event && user && (event.hostUserId === user.id || (user.orgId && event.orgId === user.orgId));
  if (!event || (event.status === "draft" && !isMine)) {
    return (
      <div className="home-page">
        <Background></Background>
        <Navbar user={user} onLogout={onLogout}></Navbar>
        <EmptyState
          title="Event not found"
          text="It may have been removed by the host."
          action={
            <Link to="/" className="btn btn-white">
              Back to all events
            </Link>
          }
        ></EmptyState>
      </div>
    );
  }

  const status = eventStatus(event);
  const host = hostName(event, organizations, users);
  const org = event.orgId ? organizations.find((o) => o.id === event.orgId) : null;
  const hostUser = event.hostUserId ? users.find((u) => u.id === event.hostUserId) : null;
  const verified = org ? org.verified : Boolean(hostUser && hostUser.phoneVerified);
  const hostEvents = events.filter((e) => e.status === "published" && sameHost(e, event));
  const liked = Boolean(user && user.likes.includes(event.id));
  const myTicket = user
    ? tickets.find((t) => t.userId === user.id && t.eventId === event.id && t.status === "confirmed")
    : null;

  /* Reviews of the host's past events ("past editions"). */
  const pastIds = hostEvents.filter(isPast).map((e) => e.id);
  const hostReviews = reviews.filter((r) => pastIds.includes(r.eventId));

  /* The user can review a past event of this host that they attended and did not review yet. */
  let toReview = null;
  if (user) {
    const attended = tickets.filter(
      (t) => t.userId === user.id && t.status === "confirmed" && pastIds.includes(t.eventId),
    );
    const notReviewed = attended.find((t) => !reviews.some((r) => r.userId === user.id && r.eventId === t.eventId));
    if (notReviewed) toReview = events.find((e) => e.id === notReviewed.eventId);
  }

  /* "You might also like": same category first, then the soonest events. */
  const similar = events
    .filter((e) => e.id !== event.id && e.status === "published" && isUpcoming(e))
    .sort((a, b) => {
      const aSame = a.category === event.category ? 0 : 1;
      const bSame = b.category === event.category ? 0 : 1;
      if (aSame !== bSame) return aSame - bSame;
      return eventStart(a) - eventStart(b);
    })
    .slice(0, 4);

  const book = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "org") {
      showToast("Organization accounts can't book tickets. Sign in as an attendee.", "error");
      return;
    }
    navigate("/checkout/" + event.id + "/" + qty);
  };

  const like = () => {
    if (!user) navigate("/login");
    else onToggleLike(event.id);
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied, share it with your friends!");
  };

  const countdown = isUpcoming(event) ? " · " + formatCountdown(eventStart(event)) : "";
  const canBook = status === "on_sale" || status === "almost_full";

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>

      <main className="detail-page">
        <Link to="/" className="back-link">
          <Icon name="arrowLeft" size={14}></Icon> All events
        </Link>

        <div className="detail-top">
          <div className="detail-cover" style={coverStyle(event)}>
            <span className="tag tag-dark">{event.category}</span>
            {event.status === "draft" && <span className="tag tag-dark">Draft · only you can see it</span>}
          </div>

          <div className="detail-info">
            <p className="detail-when">
              {formatShortDate(event.date)}
              {countdown}
            </p>
            <h1 className="detail-title">{event.title}</h1>
            <HostCard
              name={host}
              verified={verified}
              isOrganization={Boolean(event.orgId)}
              eventCount={hostEvents.length}
            ></HostCard>
            <ul className="detail-facts">
              <li>
                <Icon name="calendar" size={16}></Icon> {formatLongDate(event.date)}
              </li>
              <li>
                <Icon name="clock" size={16}></Icon> {formatTime(event.startTime)} – {formatTime(event.endTime)}
              </li>
              <li>
                <Icon name="pin" size={16}></Icon> {event.venue}
              </li>
            </ul>
            <BookBox
              event={event}
              status={status}
              qty={qty}
              onQtyChange={setQty}
              onBook={book}
              liked={liked}
              onLike={like}
              onShare={share}
              myTicket={myTicket}
            ></BookBox>
          </div>
        </div>

        <section className="detail-section">
          <h2>About this event</h2>
          <p className="detail-about">{event.description}</p>
        </section>

        <LineupList lineup={event.lineup}></LineupList>
        <LocationCard event={event}></LocationCard>
        <PastReviews
          reviews={hostReviews}
          events={events}
          onWrite={toReview ? () => setReviewOpen(true) : null}
        ></PastReviews>

        <section className="detail-section">
          <h2>You might also like</h2>
          <EventGrid
            events={similar}
            likes={user ? user.likes : []}
            onToggleLike={user ? onToggleLike : null}
            emptyTitle="No other events right now"
          ></EventGrid>
        </section>
      </main>

      {canBook && (
        <MobileBookBar qty={qty} total={minPrice(event) * qty} disabled={false} onBook={book}></MobileBookBar>
      )}

      {reviewOpen && toReview && (
        <WriteReviewModal
          event={toReview}
          onClose={() => setReviewOpen(false)}
          onSubmit={(rating, tags, text) => onAddReview(toReview.id, rating, tags, text)}
        ></WriteReviewModal>
      )}
    </div>
  );
}

export default EventDetails;
