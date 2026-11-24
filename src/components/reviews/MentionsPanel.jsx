import Panel from "../common/Panel";
import EventRatingCard from "./EventRatingCard";

/** "What people mention most" tags + the 3 most-reviewed events. */
function MentionsPanel({ tags, topEvents, selectedEvent, onSelectEvent }) {
  return (
    <Panel className="mentions-panel">
      <h2 className="panel-title">What people mention most</h2>
      <div className="tag-list">
        {tags.map(({ tag, count }) => (
          <span key={tag} className="tag">
            {tag} · {count}
          </span>
        ))}
      </div>
      <div className="event-ratings">
        {topEvents.map((e) => (
          <EventRatingCard
            key={e.id}
            name={e.name}
            avg={e.avg}
            active={selectedEvent === e.id}
            onClick={() => onSelectEvent(selectedEvent === e.id ? "all" : e.id)}
          />
        ))}
      </div>
    </Panel>
  );
}

export default MentionsPanel;
