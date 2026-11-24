import EventGrid from './EventGrid.jsx';
import AttendedItem from './AttendedItem.jsx';

/** "Saved" events (hearts) + "Attended" events with reviews. */
export default function MyEventsSection({ savedEvents, saved, attended, myReviews, onToggleSave, onOpen, onReview, now }) {
  return (
    <section className="all-events">
      <h2>Saved</h2>
      {savedEvents.length === 0 ? (
        <p className="muted">Tap the heart on any event to save it here.</p>
      ) : (
        <EventGrid events={savedEvents} saved={saved} onToggleSave={onToggleSave} onOpen={onOpen} now={now} />
      )}

      <h2 className="spaced-top">Attended</h2>
      {attended.length === 0 ? (
        <p className="muted">Events you attended will appear here so you can review them.</p>
      ) : (
        <div className="ticket-list">
          {attended.map(({ event }) => (
            <AttendedItem key={event.id} event={event} review={myReviews[event.id]} onReview={onReview} />
          ))}
        </div>
      )}
    </section>
  );
}
