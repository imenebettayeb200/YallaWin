import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hostName } from "../../utils";
import Icon from "../common/Icon";
import PickCard from "./PickCard";

/*
 * TopPicksCarousel — turns by itself every 6 seconds (useEffect + setInterval).
 * Click a side card to bring it to the centre, click the centre card to open the event.
 */
function TopPicksCarousel({ events, organizations, users }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const count = events.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;
  const current = active % count;

  /* Position of card i compared to the centre card (going around the circle). */
  const offsetOf = (i) => {
    let offset = i - current;
    if (offset > count / 2) offset = offset - count;
    if (offset < -count / 2) offset = offset + count;
    return offset;
  };

  return (
    <div className="picks">
      <button
        type="button"
        className="picks-arrow left"
        onClick={() => setActive((current - 1 + count) % count)}
        aria-label="Previous pick"
      >
        <Icon name="chevronLeft" size={16}></Icon>
      </button>
      <div className="picks-track">
        {events.map((event, i) => {
          const offset = offsetOf(i);
          if (Math.abs(offset) > 2) return null;
          return (
            <PickCard
              key={event.id}
              event={event}
              hostName={hostName(event, organizations, users)}
              offset={offset}
              onClick={() => (offset === 0 ? navigate("/event/" + event.id) : setActive(i))}
            ></PickCard>
          );
        })}
      </div>
      <button
        type="button"
        className="picks-arrow right"
        onClick={() => setActive((current + 1) % count)}
        aria-label="Next pick"
      >
        <Icon name="chevronRight" size={16}></Icon>
      </button>
    </div>
  );
}

export default TopPicksCarousel;
