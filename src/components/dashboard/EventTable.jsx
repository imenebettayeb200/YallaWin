import EventRow from "./EventRow";

const COLUMNS = ["Event", "Date", "Sold", "Revenue", "Status"];

function EventTable({ events, orgName = "", linkPrefix }) {
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
        <EventRow key={e.id} event={e} orgName={orgName} linkPrefix={linkPrefix} />
      ))}
    </div>
  );
}

export default EventTable;
