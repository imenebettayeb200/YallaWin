import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import Panel from "../common/Panel";
import EmptyState from "../common/EmptyState";
import EventTable from "./EventTable";

function UpcomingEventsPanel({ events, orgName, limit = 4 }) {
  return (
    <Panel
      className="table-panel"
      title="Upcoming events"
      actions={
        <Link to="/org/events" className="view-all">
          View all <Icon name="chevronRight" size={14} />
        </Link>
      }
    >
      {events.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          text="Create your first event to start selling tickets."
          action={
            <Link to="/org/events/new" className="btn btn-gradient">
              Create event <Icon name="plus" size={16} />
            </Link>
          }
        />
      ) : (
        <EventTable events={events.slice(0, limit)} orgName={orgName} linkPrefix="/org/events/" />
      )}
    </Panel>
  );
}

export default UpcomingEventsPanel;
