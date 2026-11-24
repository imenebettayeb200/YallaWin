import { Link } from "react-router-dom";
import { coverStyle, formatShortDate, formatTime, minPrice } from "../../utils";

/* WeekendList — "This weekend" horizontal list of small cards (made for phones, from the mobile design). */
function WeekendList({ events }) {
  if (events.length === 0) return null;
  return (
    <section className="weekend">
      <div className="section-head">
        <h2>This weekend</h2>
        <a href="#all-events" className="view-all">
          See all
        </a>
      </div>
      <div className="weekend-row">
        {events.map((event) => (
          <Link key={event.id} to={"/event/" + event.id} className="weekend-card">
            <span className="weekend-cover" style={coverStyle(event)}></span>
            <span className="weekend-title">{event.title}</span>
            <span className="weekend-meta">
              {formatShortDate(event.date)} · {formatTime(event.startTime)}
            </span>
            <span className="price-pill">{minPrice(event) === 0 ? "Free" : minPrice(event) + " TND"}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default WeekendList;
