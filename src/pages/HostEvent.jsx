import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import EmptyState from "../components/common/EmptyState";
import EventForm from "../components/create-event/EventForm";

/*
 * HostEvent — /my-events/new and /my-events/:id. "Host your own event" for normal users.
 * Same form as the organizations. Paid events need a verified phone number (see Profile).
 */
function HostEvent({ user, events, onLogout, onSave, onDelete, showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = (id ? "Edit event" : "Host your own event") + " · YallaWin";
    window.scrollTo(0, 0);
  }, [id]);

  if (!user) return <Navigate to="/login" replace></Navigate>;
  if (user.role === "org") return <Navigate to="/org/events/new" replace></Navigate>;
  const existing = id ? events.find((e) => e.id === id && e.hostUserId === user.id) : null;

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>
      <main className="host-page">
        {id && !existing ? (
          <EmptyState
            title="Event not found"
            text="It may have been deleted."
            action={
              <Link to="/my-events" className="btn btn-white">
                Back to my events
              </Link>
            }
          ></EmptyState>
        ) : (
          <EventForm
            key={id || "new"}
            existing={existing}
            host={{ hostUserId: user.id }}
            verified={user.phoneVerified}
            verifyLabel="Phone number verified (paid events)"
            verifyLink="/profile"
            title="Host your own event"
            onSave={onSave}
            onDelete={onDelete}
            onDone={() => navigate("/my-events")}
            showToast={showToast}
          ></EventForm>
        )}
      </main>
    </div>
  );
}

export default HostEvent;
