import { coverStyle } from '../common/EventThumb.jsx';
import { themeFor } from '../../data/artwork.js';
import { cityOf } from '../../hooks/useHomeEvents.js';
import { formatShortDate, formatTimeLong } from '../../utils/format.js';

/** One card of the "Top picks" carousel. offset: position relative to the centre (-2..2). */
export default function PickCard({ event, orgName, offset, onClick }) {
  const abs = Math.abs(offset);
  const isCenter = offset === 0;
  const shift = abs === 0 ? 0 : Math.sign(offset) * (abs === 1 ? 212 : 400);

  return (
    <button
      type="button"
      className={`pick ${isCenter ? 'center' : ''}`}
      style={{
        ...coverStyle(event),
        transform: `translateX(calc(-50% + ${shift}px)) scale(${isCenter ? 1 : 0.78})`,
        zIndex: 10 - abs,
        opacity: abs === 2 ? 0.85 : 1,
      }}
      onClick={onClick}
      aria-label={isCenter ? `Open ${event.title}` : `Show ${event.title}`}
    >
      {!event.coverImage && <span className="pick-emoji">{themeFor(event.category).emoji}</span>}
      {isCenter && (
        <span className="pick-tags">
          <span className="tag tag-dark">• {event.category}</span>
          <span className="tag tag-dark">• {cityOf(event.venue)}</span>
        </span>
      )}
      <span className="pick-body">
        <span className="pick-going" aria-hidden="true">
          <span style={{ background: '#ff4d4f' }} />
          <span style={{ background: '#ff9a1f' }} />
          <span style={{ background: '#3ddc84' }} />
        </span>
        <span className="pick-title">{event.title}</span>
        <span className="pick-meta">
          {formatShortDate(event.date)} · {formatTimeLong(event.startTime)}
        </span>
        <span className="pick-meta">
          {orgName} · {cityOf(event.venue)}
        </span>
      </span>
    </button>
  );
}
