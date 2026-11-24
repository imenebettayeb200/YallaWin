import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';
import SidebarAccount from './SidebarAccount.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ORG_NAV } from '../../data/data.js';

/**
 * Sidebar — left menu of the organization dashboard.
 * The menu items come from ORG_NAV in data.js. The active item is the one whose
 * link matches the current URL best (longest match), e.g. /org/events/new -> "Create event".
 */
function activeLink(pathname) {
  const matches = ORG_NAV.filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));
  return matches.reduce((best, item) => (!best || item.to.length > best.to.length ? item : best), null);
}

function NavItem({ item, active }) {
  return (
    <Link to={item.to} className={`nav-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
      <Icon name={item.icon} size={16} />
      <span>{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const { organization, logout } = useAuth();
  const navigate = useNavigate();
  const active = activeLink(pathname);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className="sidebar">
      <Link to="/org" className="sidebar-logo">
        <Logo subtitle="FOR ORGANIZATIONS" />
      </Link>

      <nav className="sidebar-nav" aria-label="Organization">
        {ORG_NAV.map((item) => (
          <NavItem key={item.to} item={item} active={active === item} />
        ))}
      </nav>

      <Link to="/" className="nav-item nav-item-subtle">
        <Icon name="external" size={15} />
        <span>View home page</span>
      </Link>

      <SidebarAccount organization={organization} onLogout={handleLogout} />
    </aside>
  );
}