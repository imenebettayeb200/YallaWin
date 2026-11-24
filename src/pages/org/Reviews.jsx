import { useEffect, useState } from "react";
import { reviewTabs } from "../../Data";
import PageHeader from "../../components/layout/PageHeader";
import Panel from "../../components/common/Panel";
import PillTabs from "../../components/common/PillTabs";
import EmptyState from "../../components/common/EmptyState";
import RatingSummary from "../../components/reviews/RatingSummary";
import MentionsPanel from "../../components/reviews/MentionsPanel";
import EventSelect from "../../components/reviews/EventSelect";
import ReviewItem from "../../components/reviews/ReviewItem";

const pageSize = 10;

/* Adds the year when two events have the same title, e.g. "Jazz-in (2025)". */
function eventName(event, list) {
  if (!event) return "Deleted event";
  const twin = list.some((e) => e.id !== event.id && e.title === event.title);
  return twin ? event.title + " (" + event.date.slice(0, 4) + ")" : event.title;
}

/* Reviews — /org/reviews. Rating summary, most mentioned tags, and every review with a reply box. */
function Reviews({ organization, events, reviews, notifications, onReply }) {
  const [tab, setTab] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [limit, setLimit] = useState(pageSize);

  useEffect(() => {
    document.title = "Reviews · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  const orgEvents = events.filter((e) => e.orgId === organization.id);
  const orgReviews = reviews
    .filter((r) => orgEvents.some((e) => e.id === r.eventId))
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = orgReviews.length;
  const avg = total ? orgReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = orgReviews.filter((r) => r.rating === star).length;
    return { star: star, count: count, pct: total ? Math.round((count / total) * 100) : 0 };
  });
  const goAgain = total ? Math.floor((orgReviews.filter((r) => r.rating >= 3).length / total) * 100) : 0;

  /* How many times each tag is mentioned. */
  const tagCounts = {};
  orgReviews.forEach((r) => {
    r.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const tags = Object.keys(tagCounts)
    .map((tag) => ({ tag: tag, count: tagCounts[tag] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  /* Average rating of each reviewed event. */
  const reviewedEvents = orgEvents
    .map((e) => {
      const list = orgReviews.filter((r) => r.eventId === e.id);
      const average = list.length ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0;
      return { id: e.id, name: eventName(e, orgEvents), avg: average, count: list.length };
    })
    .filter((e) => e.count > 0);
  const topEvents = [...reviewedEvents].sort((a, b) => b.count - a.count).slice(0, 3);

  const counts = {
    all: total,
    "needs-reply": orgReviews.filter((r) => !r.reply).length,
    low: orgReviews.filter((r) => r.rating <= 2).length,
  };

  const filtered = orgReviews.filter((r) => {
    if (tab === "needs-reply" && r.reply) return false;
    if (tab === "low" && r.rating > 2) return false;
    return eventFilter === "all" || r.eventId === eventFilter;
  });
  const visible = filtered.slice(0, limit);

  const changeTab = (key) => {
    setTab(key);
    setLimit(pageSize);
  };

  const changeEvent = (id) => {
    setEventFilter(id);
    setLimit(pageSize);
  };

  /* Returns true so the reply box empties itself. */
  const handleReply = (reviewId, text) => {
    onReply(reviewId, text);
    return true;
  };

  return (
    <div className="page">
      <PageHeader
        title="Reviews"
        subtitle="What attendees say about your events"
        notifications={notifications}
      ></PageHeader>
      {total === 0 ? (
        <Panel>
          <EmptyState
            icon="star"
            title="No reviews yet"
            text="Attendees can review your events after they end."
          ></EmptyState>
        </Panel>
      ) : (
        <div className="reviews-top">
          <RatingSummary avg={avg} total={total} goAgain={goAgain} distribution={distribution}></RatingSummary>
          <MentionsPanel
            tags={tags}
            topEvents={topEvents}
            selectedEvent={eventFilter}
            onSelectEvent={changeEvent}
          ></MentionsPanel>
        </div>
      )}
      <div className="toolbar">
        <PillTabs tabs={reviewTabs} value={tab} counts={counts} onChange={changeTab}></PillTabs>
        <EventSelect value={eventFilter} options={reviewedEvents} onChange={changeEvent}></EventSelect>
      </div>
      <div className="review-list">
        {visible.length === 0 && total > 0 && (
          <Panel>
            <EmptyState icon="message" title="Nothing to show" text="No reviews match these filters."></EmptyState>
          </Panel>
        )}
        {visible.map((r) => (
          <ReviewItem
            key={r.id}
            review={r}
            eventName={eventName(
              orgEvents.find((e) => e.id === r.eventId),
              orgEvents,
            )}
            orgName={organization.name}
            onReply={handleReply}
          ></ReviewItem>
        ))}
        {filtered.length > visible.length && (
          <button type="button" className="btn btn-outline load-more" onClick={() => setLimit(limit + pageSize)}>
            Load more ({filtered.length - visible.length} left)
          </button>
        )}
      </div>
    </div>
  );
}

export default Reviews;
