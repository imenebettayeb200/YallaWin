import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import NotificationsBell from "./NotificationsBell";

/* PageHeader — title + subtitle of a dashboard page, with the bell and the buttons on the right. */
function PageHeader({ title, subtitle, notifications, showCreate, children }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="page-actions">
        <Link to="/org/events" className="icon-btn" aria-label="Search events">
          <Icon name="search" size={17}></Icon>
        </Link>
        <NotificationsBell notifications={notifications}></NotificationsBell>
        {children}
        {showCreate && (
          <Link to="/org/events/new" className="btn btn-gradient">
            Create event <Icon name="plus" size={16}></Icon>
          </Link>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
