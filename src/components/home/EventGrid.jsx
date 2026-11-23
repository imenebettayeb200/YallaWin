import EventCard from './EventCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function EventGrid({ events, saved, onToggleSave, onOpen, emptyTitle = 'No events found', emptyText = 'Try another category, city or search.' }) {
  if (events.length === 0) return <EmptyState icon="search" title={emptyTitle} text={emptyText} />;
  return (
    <div className="ev-grid">
      {events.map((e) => (
        <EventCard key={e.id} event={e} saved={saved.has(e.id)} onToggleSave={onToggleSave} onOpen={onOpen} />
      ))}
    </div>
  );
}
