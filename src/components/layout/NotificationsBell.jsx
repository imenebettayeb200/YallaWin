import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import useClickOutside from '../../hooks/useClickOutside.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDbState } from '../../data/useDb.js';
import { eventStatus } from '../../models/index.js';

export default function NotificationsBell() {
  const { organization } = useAuth();
  const state = useDbState();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, open, close);

  const items = useMemo(() => {
    const list = [];
    const needReply = state.reviews.filter((r) => r.orgId === organization.id && !r.reply).length;
    if (needReply > 0) {
      list.push({ id: 'reviews', icon: 'message', text: `${needReply} review${needReply > 1 ? 's' : ''} waiting for a reply`, to: '/org/reviews?tab=needs-reply' });
    }
    state.events
      .filter((e) => e.orgId === organization.id)
      .forEach((e) => {
        const s = eventStatus(e);
        if (s === 'sold_out') list.push({ id: `so-${e.id}`, icon: 'ticket', text: `${e.title} is sold out`, to: `/org/events/${e.id}` });
        if (s === 'almost_full') list.push({ id: `af-${e.id}`, icon: 'ticket', text: `${e.title} is almost full`, to: `/org/events/${e.id}` });
      });
    if (!organization.verified) list.push({ id: 'verify', icon: 'shield', text: 'Verify your organization to publish events', to: '/org/settings' });
    return list;
  }, [state, organization]);

  return (
    <div className="popover-wrap" ref={ref}>
      <button type="button" className="icon-btn" onClick={() => setOpen((v) => !v)} aria-label="Notifications" aria-expanded={open}>
        <Icon name="bell" size={17} />
        {items.length > 0 && <span className="bell-dot" />}
      </button>
      {open && (
        <div className="popover" role="menu">
          <p className="popover-title">Notifications</p>
          {items.length === 0 && <p className="popover-empty">You&apos;re all caught up.</p>}
          {items.map((item) => (
            <Link key={item.id} to={item.to} className="popover-item" onClick={close} role="menuitem">
              <Icon name={item.icon} size={15} />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
