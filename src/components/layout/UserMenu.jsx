import { useState } from "react";
import { Link } from "react-router-dom";
import { fullName } from "../../utils";
import Avatar from "../common/Avatar";
import Icon from "../common/Icon";

/* UserMenu — the name button at the top right: profile, tickets, dashboard and sign out. */
function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const name = fullName(user);

  const signOut = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="popover-wrap">
      <button type="button" className="user-chip" onClick={() => setOpen(!open)}>
        <Avatar name={name} size={24}></Avatar>
        <span>{user.firstName}</span>
        <Icon name="chevronDown" size={13}></Icon>
      </button>
      {open && <div className="popover-backdrop" onClick={() => setOpen(false)}></div>}
      {open && (
        <div className="popover popover-right" role="menu">
          <p className="popover-title">{name}</p>
          <p className="popover-empty">{user.email}</p>
          {user.role === "org" ? (
            <Link to="/org" className="popover-item">
              <Icon name="overview" size={14}></Icon> Organization dashboard
            </Link>
          ) : (
            <>
              <Link to="/profile" className="popover-item">
                <Icon name="user" size={14}></Icon> My profile
              </Link>
              <Link to="/going" className="popover-item">
                <Icon name="ticketPlain" size={14}></Icon> My tickets
              </Link>
            </>
          )}
          <button type="button" className="popover-item" onClick={signOut}>
            <Icon name="logout" size={14}></Icon> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
