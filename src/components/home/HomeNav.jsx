import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Logo from '../common/Logo.jsx';
import SearchInput from '../common/SearchInput.jsx';
import UserMenu from './UserMenu.jsx';
import { ROLES } from '../../models/index.js';

export const HOME_TABS = [
  { key: 'home', label: 'Home', icon: 'overview' },
  { key: 'going', label: 'Going To', icon: 'ticketPlain' },
  { key: 'mine', label: 'My Events', icon: 'sparkle' },
];

/** Top bar: logo · Home / Going To / My Events · search · account. */
export default function HomeNav({ tab, onTabChange, search, onSearch, user, onLogout }) {
  return (
    <header className="home-nav">
      <Link to="/" aria-label="YallaWin home">
        <Logo className="home-logo" />
      </Link>

      <nav className="home-tabs" aria-label="Main">
        {HOME_TABS.map((t) => (
          <button key={t.key} type="button" className={tab === t.key ? 'active' : ''} onClick={() => onTabChange(t.key)} aria-current={tab === t.key ? 'page' : undefined}>
            <Icon name={t.icon} size={13} /> {t.label}
          </button>
        ))}
      </nav>

      <div className="home-nav-right">
        <SearchInput className="home-search" placeholder="Search events" value={search} onChange={onSearch} />
        {user && user.role === ROLES.ORG && (
          <Link to="/org" className="btn btn-gradient btn-nav">
            Dashboard <Icon name="arrowRight" size={14} />
          </Link>
        )}
        {user ? (
          <UserMenu user={user} onLogout={onLogout} />
        ) : (
          <>
            <Link to="/login" className="btn btn-white btn-nav">
              Sign in
            </Link>
            <Link to="/register" className="btn btn-outline btn-nav hide-mobile">
              Create account
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
