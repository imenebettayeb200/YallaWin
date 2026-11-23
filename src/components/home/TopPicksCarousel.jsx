import { useEffect, useState } from 'react';
import Icon from '../common/Icon.jsx';
import PickCard from './PickCard.jsx';

/** Auto-rotating carousel; click a side card to bring it to the centre, click the centre to open it. */
export default function TopPicksCarousel({ events, orgNames, onOpen }) {
  const [active, setActive] = useState(0);
  const count = events.length;

  useEffect(() => {
    if (count < 2) return undefined;
    const t = window.setInterval(() => setActive((a) => (a + 1) % count), 6000);
    return () => window.clearInterval(t);
  }, [count]);

  if (count === 0) return null;
  const current = active % count;

  const offsetOf = (i) => {
    let offset = i - current;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  return (
    <div className="picks">
      <button type="button" className="picks-arrow left" onClick={() => setActive((current - 1 + count) % count)} aria-label="Previous pick">
        <Icon name="chevronLeft" size={16} />
      </button>
      <div className="picks-track">
        {events.map((e, i) => {
          const offset = offsetOf(i);
          if (Math.abs(offset) > 2) return null;
          return (
            <PickCard
              key={e.id}
              event={e}
              orgName={orgNames[e.orgId]}
              offset={offset}
              onClick={() => (offset === 0 ? onOpen(e) : setActive(i))}
            />
          );
        })}
      </div>
      <button type="button" className="picks-arrow right" onClick={() => setActive((current + 1) % count)} aria-label="Next pick">
        <Icon name="chevronRight" size={16} />
      </button>
    </div>
  );
}
