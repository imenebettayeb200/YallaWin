import { formatShortDate } from "../../utils";
import EventThumb from "../common/EventThumb";
import Icon from "../common/Icon";

/* ReviewPrompt — banner "How was Pottery for Beginners? You attended on Sun, 16 Nov" + "Leave review". */
function ReviewPrompt({ event, onReview }) {
  return (
    <div className="review-prompt panel">
      <EventThumb event={event} size={48}></EventThumb>
      <div>
        <p className="strong">How was {event.title}?</p>
        <p className="muted small">You attended on {formatShortDate(event.date)} · Your review helps others decide.</p>
      </div>
      <button type="button" className="btn btn-gradient btn-sm" onClick={() => onReview(event)}>
        <Icon name="star" size={14}></Icon> Leave review
      </button>
    </div>
  );
}

export default ReviewPrompt;
