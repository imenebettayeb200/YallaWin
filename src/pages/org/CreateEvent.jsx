import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import NotificationsBell from "../../components/layout/NotificationsBell";
import Panel from "../../components/common/Panel";
import EmptyState from "../../components/common/EmptyState";
import EventForm from "../../components/create-event/EventForm";

/* CreateEvent — /org/events/new (create) and /org/events/:id (edit) for organizations. */
function CreateEvent({ organization, events, notifications, onSave, onDelete, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = id ? events.find((e) => e.id === id && e.orgId === organization.id) : null;

  useEffect(() => {
    document.title = (id ? "Edit event" : "Create event") + " · YallaWin";
    window.scrollTo(0, 0);
  }, [id]);

  if (id && !existing) {
    return (
      <div className="page">
        <PageHeader title="Event not found" notifications={notifications}></PageHeader>
        <Panel>
          <EmptyState
            title="This event doesn't exist"
            text="It may have been deleted."
            action={
              <Link to="/org/events" className="btn btn-outline">
                Back to events
              </Link>
            }
          ></EmptyState>
        </Panel>
      </div>
    );
  }

  return (
    <div className="page">
      <EventForm
        key={id || "new"}
        existing={existing}
        host={{ orgId: organization.id }}
        verified={organization.verified}
        verifyLabel="Organization verified"
        verifyLink="/org/settings"
        title="Create an event"
        headerExtra={<NotificationsBell notifications={notifications}></NotificationsBell>}
        onSave={onSave}
        onDelete={onDelete}
        onDone={() => navigate("/org/events")}
        showToast={showToast}
      ></EventForm>
    </div>
  );
}

export default CreateEvent;
