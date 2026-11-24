import Icon from "../common/Icon";
import { cityOf, coverStyle, formatShortDate, formatTime } from "../../utils";

/** "LIVE PREVIEW" card that updates while the form is typed. */
function EventPreviewCard({ event }) {
  const capacity = event.tiers.reduce((s, t) => s + (Number(t.quantity) || 0), 0);
  const price = event.tiers.length ? Math.min(...event.tiers.map((t) => Number(t.price) || 0)) : 0;

  return (
    <>
      <p className="preview-label">LIVE PREVIEW</p>
      <div className="preview-card" style={coverStyle(event)}>
        <span className="preview-heart">
          <Icon name="heart" size={14} />
        </span>
        <div className="preview-body">
          <h3>{event.title.trim() || "Your event title"}</h3>
          <p>
            {event.date ? formatShortDate(event.date) : "Pick a date"}
            {event.startTime ? ` · ${formatTime(event.startTime)}` : ""}
            {event.venue.trim() ? ` · ${cityOf(event.venue)}` : ""}
          </p>
          <div className="preview-foot">
            <span className="price-pill">{price === 0 ? "Free" : `${price} TND`}</span>
            <span className="preview-spots">{capacity} spots</span>
            <span className="preview-share">
              <Icon name="share" size={13} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventPreviewCard;
