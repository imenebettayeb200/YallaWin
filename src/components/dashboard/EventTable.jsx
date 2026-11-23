import EventRow from './EventRow.jsx';

const COLUMNS = ['Event', 'Date', 'Sold', 'Revenue', 'Status'];

export default function EventTable({ events, orgName = '', onOpen }) {
  return (
    <div className="event-table" role="table">
      <div className="event-row event-head" role="row">
        {COLUMNS.map((c) => (
          <span key={c} role="columnheader">
            {c}
          </span>
        ))}
        <span aria-hidden="true" />
      </div>
      {events.map((e) => (
        <EventRow key={e.id} event={e} orgName={orgName} onOpen={onOpen} />
      ))}
    </div>
  );
}
