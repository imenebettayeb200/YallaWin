import { Link } from "react-router-dom";
import {
  cityOf,
  coverStyle,
  eventStart,
  formatCountdown,
  formatShortDate,
  formatTime,
  isUpcoming,
  minPrice,
  spotsLeft,
} from "../../utils";
import Icon from "../common/Icon";

/*
 * EventCard — portrait card with the cover, heart, title, date, countdown, price and spots left.
 * Clicking the card opens the event page. The heart only shows when onToggleLike is given.
 */
function EventCard({ event, liked, onToggleLike }) {
  const left = spotsLeft(event);
  const price = minPrice(event);
  const countdown = isUpcoming(event) ? formatCountdown(eventStart(event)) : "";

  const clickHeart = (e) => {
    e.preventDefault(); /* do not open the event page */
    onToggleLike(event.id);
  };

  return (
    <Link to={"/event/" + event.id} className="ev-card" style={coverStyle(event)}>
      {onToggleLike && (
        <button
          type="button"
          className={liked ? "heart-btn saved" : "heart-btn"}
          onClick={clickHeart}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Icon name="heart" size={13} filled={liked}></Icon>
        </button>
      )}
      <div className="ev-card-body">
        <h3>{event.title}</h3>
        <p>
          {formatShortDate(event.date)} · {formatTime(event.startTime)} · {cityOf(event.venue)}
          {countdown && <span className="ev-when">{countdown}</span>}
        </p>
        <div className="ev-card-foot">
          <span className="price-pill">{price === 0 ? "Free" : price + " TND"}</span>
          <span className="ev-left">{left <= 0 ? "Sold out" : left + " spots left"}</span>
          <span className="ticket-btn" aria-hidden="true">
            <Icon name="ticketPlain" size={13}></Icon>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
