import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Panel from '../common/Panel.jsx';
import EmptyState from '../common/EmptyState.jsx';
import EventTable from './EventTable.jsx';

export default function UpcomingEventsPanel({ events, orgName, limit = 4 }) {
  const navigate = useNavigate();
  return (
    <Panel
      className="table-panel"
      title="Upcoming events"
      actions={
        <Link to="/org/events?tab=upcoming" className="view-all">
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
        <EventTable events={events.slice(0, limit)} orgName={orgName} onOpen={(id) => navigate(`/org/events/${id}`)} />
      )}
    </Panel>
  );
}
