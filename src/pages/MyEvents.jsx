import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { hostTabs } from "../Data";
import { averageRating, eventRevenue, eventSold, eventStart, eventStatus, formatTND } from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Icon from "../components/common/Icon";
import PillTabs from "../components/common/PillTabs";
import EmptyState from "../components/common/EmptyState";
import KpiCard from "../components/dashboard/KpiCard";
import HostedEventRow from "../components/myevents/HostedEventRow";
import ReviewCard from "../components/reviews/ReviewCard";

/* Which tab an event belongs to. */
function tabOf(event) {
  const status = eventStatus(event);
  if (status === "draft") return "drafts";
  if (status === "ended") return "past";
  return "published";
}

/*
 * MyEvents — /my-events. "Events you host": any user can host small events.
 * Stats, the user's events (Published / Drafts / Past) with "Manage", and the latest reviews.
 */
function MyEvents({ user, events, reviews, onLogout }) {
  const [tab, setTab] = useState("published");
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    document.title = "My events · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  if (!user) return <Navigate to="/login" replace></Navigate>;
  if (user.role === "org") return <Navigate to="/org/events" replace></Navigate>;

  const myEvents = events.filter((e) => e.hostUserId === user.id);
  const myIds = myEvents.map((e) => e.id);
  const myReviews = reviews.filter((r) => myIds.includes(r.eventId)).sort((a, b) => b.date.localeCompare(a.date));
  const ticketsSold = myEvents.reduce((sum, e) => sum + eventSold(e), 0);
  const revenue = myEvents.reduce((sum, e) => sum + eventRevenue(e), 0);

  const counts = { published: 0, drafts: 0, past: 0 };
  myEvents.forEach((e) => {
    counts[tabOf(e)] = counts[tabOf(e)] + 1;
  });

  /* Sorted by date (events without a date at the end). */
  const visible = myEvents
    .filter((e) => tabOf(e) === tab)
    .sort((a, b) => (a.date ? eventStart(a).getTime() : Infinity) - (b.date ? eventStart(b).getTime() : Infinity));
  const reviewList = showAllReviews ? myReviews : myReviews.slice(0, 3);
  const eventTitle = (id) => myEvents.find((e) => e.id === id).title;

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>

      <main className="going-page">
        <div className="host-head">
          <div>
            <h1 className="big-title">
              Events you <em>host</em>
            </h1>
            <p className="muted">Create, publish and track everything you organize on YallaWin.</p>
          </div>
          <Link to="/my-events/new" className="btn btn-gradient">
            Create event <Icon name="plus" size={16}></Icon>
          </Link>
        </div>

        <div className="kpi-grid">
          <KpiCard
            label="Events hosted"
            icon="calendar"
            value={myEvents.length}
            footer={<span className="muted small">{counts.drafts} draft(s)</span>}
          ></KpiCard>
          <KpiCard
            label="Tickets sold"
            icon="ticketPlain"
            value={ticketsSold}
            footer={<span className="muted small">All your events</span>}
          ></KpiCard>
          <KpiCard
            label="Revenue"
            icon="wallet"
            value={formatTND(revenue)}
            footer={<span className="muted small">Before fees</span>}
          ></KpiCard>
          <KpiCard
            label="Average rating"
            icon="star"
            value={myReviews.length ? averageRating(myReviews).toFixed(1) : "—"}
            footer={<span className="muted small">{myReviews.length} reviews</span>}
          ></KpiCard>
        </div>

        <div className="section-head">
          <h2>Your events</h2>
          <span className="muted small">Sorted by date</span>
        </div>
        <PillTabs tabs={hostTabs} value={tab} counts={counts} onChange={setTab}></PillTabs>
        {visible.length === 0 ? (
          <EmptyState
            icon="sparkle"
            title="Nothing here yet"
            text="Host a workshop, a game night or a beach cleanup: anyone can host on YallaWin."
            action={
              <Link to="/my-events/new" className="btn btn-white">
                Create your first event
              </Link>
            }
          ></EmptyState>
        ) : (
          <div className="booking-list">
            {visible.map((event) => (
              <HostedEventRow key={event.id} event={event}></HostedEventRow>
            ))}
          </div>
        )}

        <div className="section-head">
          <h2>Latest reviews</h2>
          {myReviews.length > 3 && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAllReviews(!showAllReviews)}>
              {showAllReviews ? "Show less" : "View all (" + myReviews.length + ")"}
            </button>
          )}
        </div>
        {myReviews.length === 0 ? (
          <p className="muted">Reviews of your past events will appear here.</p>
        ) : (
          <div className="review-list">
            {reviewList.map((review) => (
              <ReviewCard key={review.id} review={review} eventName={eventTitle(review.eventId)}></ReviewCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyEvents;
