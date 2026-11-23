import EmptyState from '../common/EmptyState.jsx';
import TicketItem from './TicketItem.jsx';

export default function GoingToSection({ tickets, onOpen, onBrowse }) {
  return (
    <section className="all-events">
      <h2>Going to</h2>
      {tickets.length === 0 ? (
        <EmptyState
          icon="ticketPlain"
          title="No tickets yet"
          text="Find something fun on the home page."
          action={
            <button type="button" className="btn btn-white" onClick={onBrowse}>
              Browse events
            </button>
          }
        />
      ) : (
        <div className="ticket-list">
          {tickets.map(({ event, qty }) => (
            <TicketItem key={event.id} event={event} qty={qty} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  );
}
