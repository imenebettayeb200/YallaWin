import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';
import SidebarAccount from './SidebarAccount.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { to: '/org', label: 'Overview', icon: 'overview', match: (p) => p === '/org' || p === '/org/' },
  { to: '/org/events', label: 'Events', icon: 'calendar', match: (p) => p.startsWith('/org/events') && !p.startsWith('/org/events/new') },
  { to: '/org/events/new', label: 'Create event', icon: 'plus', match: (p) => p.startsWith('/org/events/new') },
  { to: '/org/reviews', label: 'Reviews', icon: 'star', match: (p) => p.startsWith('/org/reviews') },
  { to: '/org/payouts', label: 'Payouts', icon: 'payouts', match: (p) => p.startsWith('/org/payouts') },
  { to: '/org/settings', label: 'Settings', icon: 'sliders', match: (p) => p.startsWith('/org/settings') },
];

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
        {NAV.map((item) => (
          <NavItem key={item.to} item={item} active={item.match(pathname)} />
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
