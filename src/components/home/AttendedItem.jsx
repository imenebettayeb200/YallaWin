import Stars from '../common/Stars.jsx';
import { coverStyle } from '../common/EventThumb.jsx';
import QuickReviewForm from './QuickReviewForm.jsx';
import { formatShortDate } from '../../utils/format.js';

/** Past event the user attended, with their review or a form to write one. */
export default function AttendedItem({ event, review, onReview }) {
  return (
    <div className="ticket-item static">
      <span className="ticket-thumb" style={coverStyle(event)} />
      <span className="ticket-info">
        <span className="ticket-title">{event.title}</span>
        <span className="ticket-meta">
          {formatShortDate(event.date, true)} · {event.venue}
        </span>
      </span>
      {review ? (
        <span className="reviewed">
          <Stars rating={review.rating} /> Reviewed
        </span>
      ) : (
        <QuickReviewForm onSubmit={(rating, text) => onReview(event, rating, text)} />
      )}
    </div>
  );
}
