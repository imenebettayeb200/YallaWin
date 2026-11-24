import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../common/Icon";

/* NotificationsBell — bell button of the dashboard with a red dot and a list of alerts. */
function NotificationsBell({ notifications }) {
  const [open, setOpen] = useState(false);
  const list = notifications || [];

  return (
    <div className="popover-wrap">
      <button type="button" className="icon-btn" onClick={() => setOpen(!open)} aria-label="Notifications">
        <Icon name="bell" size={17}></Icon>
        {list.length > 0 && <span className="bell-dot"></span>}
      </button>
      {open && <div className="popover-backdrop" onClick={() => setOpen(false)}></div>}
      {open && (
        <div className="popover" role="menu">
          <p className="popover-title">Notifications</p>
          {list.length === 0 && <p className="popover-empty">You're all caught up.</p>}
          {list.map((item) => (
            <Link key={item.id} to={item.to} className="popover-item" onClick={() => setOpen(false)}>
              <Icon name={item.icon} size={15}></Icon>
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
