import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar.jsx';
import Icon from '../common/Icon.jsx';
import useClickOutside from '../../hooks/useClickOutside.js';
import { ROLES } from '../../models/index.js';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, open, close);

  return (
    <div className="popover-wrap" ref={ref}>
      <button type="button" className="user-chip" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Avatar name={user.name} size={24} />
        <span>{user.name.split(' ')[0]}</span>
        <Icon name="chevronDown" size={13} />
      </button>
      {open && (
        <div className="popover popover-right" role="menu">
          <p className="popover-title">{user.name}</p>
          <p className="popover-empty">{user.email}</p>
          {user.role === ROLES.ORG && (
            <Link to="/org" className="popover-item" role="menuitem">
              <Icon name="overview" size={14} /> Organization dashboard
            </Link>
          )}
          <button type="button" className="popover-item" onClick={onLogout} role="menuitem">
            <Icon name="logout" size={14} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
