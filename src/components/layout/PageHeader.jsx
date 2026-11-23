import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import NotificationsBell from './NotificationsBell.jsx';

/** Title + subtitle on the left; search, bell, custom actions and "Create event" on the right. */
export default function PageHeader({ title, subtitle, children, showCreate = false, showSearch = true }) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="page-actions">
        {showSearch && (
          <button type="button" className="icon-btn" aria-label="Search events" onClick={() => navigate('/org/events?focus=search')}>
            <Icon name="search" size={17} />
          </button>
        )}
        <NotificationsBell />
        {children}
        {showCreate && (
          <Link to="/org/events/new" className="btn btn-gradient">
            Create event <Icon name="plus" size={16} />
          </Link>
        )}
      </div>
    </header>
  );
}
