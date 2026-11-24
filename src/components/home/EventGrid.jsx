import EventCard from "./EventCard";
import EmptyState from "../common/EmptyState";

/* EventGrid — grid of EventCards, or a message when the list is empty. likes = ids of liked events. */
function EventGrid({ events, likes, onToggleLike, emptyTitle, emptyText }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon="search"
        title={emptyTitle || "No events found"}
        text={emptyText || "Try another category, city or search."}
      ></EmptyState>
    );
  }
  return (
    <div className="ev-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          liked={likes.includes(event.id)}
          onToggleLike={onToggleLike}
        ></EventCard>
      ))}
    </div>
  );
}

export default EventGrid;
