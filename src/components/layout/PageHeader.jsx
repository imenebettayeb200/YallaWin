import { Link, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import NotificationsBell from './NotificationsBell.jsx';
import usePageTitle from '../../hooks/usePageTitle.js';

/**
 * Title + subtitle on the left; search, bell, custom actions and "Create event" on the right.
 * Also sets the browser tab title (pageTitle if given, otherwise title).
 */
export default function PageHeader({ title, subtitle, pageTitle, children, showCreate = false, showSearch = true }) {
  const navigate = useNavigate();
  usePageTitle(pageTitle || title);
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