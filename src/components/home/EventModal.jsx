import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { coverStyle } from '../common/EventThumb.jsx';
import TierOptions from './TierOptions.jsx';
import QuantityPicker from './QuantityPicker.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { eventStart, eventStatus, ROLES, STATUS_LABELS } from '../../models/index.js';
import { buyTicket } from '../../services/eventService.js';
import { formatCountdown, formatShortDate, formatTimeLong, formatTND } from '../../utils/format.js';
import useNow from '../../hooks/useNow.js';

function MetaLine({ icon, children }) {
  return (
    <p className="modal-meta">
      <Icon name={icon} size={14} /> {children}
    </p>
  );
}

/** Event details popup with ticket purchase. */
export default function EventModal({ event, orgName, user, onClose }) {
  const toast = useToast();
  const navigate = useNavigate();
  const now = useNow();
  const status = eventStatus(event, now);
  const countdown = status === 'ended' || status === 'draft' ? '' : formatCountdown(eventStart(event), now);
  const onSale = status !== 'ended' && status !== 'draft';
  const firstAvailable = event.tiers.find((t) => t.quantity - t.sold > 0);
  const [tierId, setTierId] = useState(firstAvailable ? firstAvailable.id : '');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const tier = event.tiers.find((t) => t.id === tierId);
  const remaining = tier ? tier.quantity - tier.sold : 0;

  const handleBuy = () => {
    setError('');
    if (!user) {
      onClose();
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (user.role !== ROLES.USER) {
      setError('Organization accounts cannot buy tickets. Sign in with an attendee account.');
      return;
    }
    try {
      buyTicket({ eventId: event.id, tierId, userId: user.id, qty });
      toast.show(`You're going to ${event.title}! 🎉`);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  let buyLabel = `Pay ${tier ? formatTND(tier.price * qty) : ''}`;
  if (!user) buyLabel = 'Sign in to get tickets';
  else if (tier && tier.price === 0) buyLabel = 'Reserve';

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={event.title}>
        <div className="modal-cover" style={coverStyle(event)}>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
          <span className="tag tag-dark">{event.category}</span>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{event.title}</h2>
          <MetaLine icon="calendar">
            {formatShortDate(event.date, true)} · {formatTimeLong(event.startTime)} – {formatTimeLong(event.endTime)}
            {countdown ? ` · ${countdown}` : ''}
          </MetaLine>
          <MetaLine icon="pin">{event.venue}</MetaLine>
          <MetaLine icon="user">Hosted by {orgName}</MetaLine>
          {event.description && <p className="modal-desc">{event.description}</p>}

          {!onSale && <p className="muted">{STATUS_LABELS[status]} — tickets are no longer available.</p>}
          {onSale && (
            <>
              <p className="field-label">Choose your ticket</p>
              <TierOptions
                tiers={event.tiers}
                value={tierId}
                onChange={(id) => {
                  setTierId(id);
                  setQty(1);
                }}
              />
              {tier ? (
                <div className="buy-row">
                  <QuantityPicker value={qty} max={Math.min(10, remaining)} onChange={setQty} />
                  <button type="button" className="btn btn-gradient" onClick={handleBuy} disabled={remaining <= 0}>
                    {buyLabel} <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              ) : (
                <p className="muted small">All tickets are sold out.</p>
              )}
              {error && <p className="field-error">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
