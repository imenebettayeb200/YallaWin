import { useEffect, useState } from "react";
import { ratingLabels, reviewTags } from "../../Data";
import { formatShortDate } from "../../utils";
import Icon from "../common/Icon";
import StarPicker from "../common/StarPicker";

/*
 * WriteReviewModal — "How was it?" popup: stars, "What stood out?" chips and a text.
 * onSubmit(rating, tags, text) is called when the form is valid.
 */
function WriteReviewModal({ event, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  /* Escape closes the popup, and the page behind does not scroll while it is open. */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  const toggleTag = (tag) => {
    if (tags.includes(tag)) setTags(tags.filter((t) => t !== tag));
    else setTags([...tags, tag]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Pick a rating from 1 to 5 stars.");
      return;
    }
    if (text.trim().length < 5) {
      setError("Tell us a bit more (at least 5 characters).");
      return;
    }
    onSubmit(rating, tags, text);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal review-modal" onSubmit={handleSubmit}>
        <div className="review-modal-head">
          <h2>How was it?</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={16}></Icon>
          </button>
        </div>
        <p className="review-modal-event">{event.title}</p>
        <p className="muted small">
          Attended {formatShortDate(event.date)} · {event.venue}
        </p>

        <div className="review-modal-stars">
          <StarPicker value={rating} onChange={setRating} size={30}></StarPicker>
          <p className="muted small">
            {rating > 0 ? ratingLabels[rating] + " — " + rating + " out of 5" : "Tap a star"}
          </p>
        </div>

        <p className="field-label">What stood out?</p>
        <div className="chips">
          {reviewTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={tags.includes(tag) ? "chip active" : "chip"}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <textarea
          className="input textarea"
          rows={4}
          maxLength={500}
          placeholder="Tell others what you liked (or not)…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {error && <p className="field-error">{error}</p>}
        <button type="submit" className="btn btn-gradient btn-block">
          Post review <Icon name="arrowRight" size={16}></Icon>
        </button>
      </form>
    </div>
  );
}

export default WriteReviewModal;
