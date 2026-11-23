import Avatar from '../common/Avatar.jsx';
import Stars from '../common/Stars.jsx';
import { timeAgo } from '../../utils/format.js';

export default function ReviewCard({ review, eventName }) {
  return (
    <article className="panel review-card">
      <div className="review-head">
        <Avatar name={review.authorName} size={30} />
        <div className="review-who">
          <span className="review-name">{review.authorName}</span>
          <span className="review-meta">
            {eventName} · {timeAgo(review.createdAt)}
          </span>
        </div>
        <Stars rating={review.rating} size={15} />
      </div>
      <p className="review-text">{review.text}</p>
    </article>
  );
}
