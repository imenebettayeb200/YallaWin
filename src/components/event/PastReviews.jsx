import { averageRating } from "../../utils";
import Stars from "../common/Stars";
import Icon from "../common/Icon";
import ReviewCard from "../reviews/ReviewCard";

/*
 * PastReviews — "Reviews from past editions": the rating of the host's past events,
 * the 5→1 bars and the 3 latest reviews. onWrite is given only when the user can write one.
 */
function PastReviews({ reviews, events, onWrite }) {
  const average = averageRating(reviews);
  const latest = [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const eventTitle = (id) => {
    const found = events.find((e) => e.id === id);
    return found ? found.title : "Past event";
  };

  return (
    <section className="detail-section">
      <div className="section-head">
        <h2>Reviews from past editions</h2>
        {onWrite && (
          <button type="button" className="btn btn-outline btn-sm" onClick={onWrite}>
            <Icon name="pencil" size={14}></Icon> Write review
          </button>
        )}
      </div>
      {reviews.length === 0 ? (
        <p className="muted">No reviews yet for this host.</p>
      ) : (
        <div className="past-reviews">
          <div className="panel past-summary">
            <p className="rating-big">{average.toFixed(1)}</p>
            <Stars rating={average} size={15}></Stars>
            <p className="muted small">Based on {reviews.length} reviews</p>
            <ul className="dist">
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100);
                return (
                  <li key={star}>
                    <span className="dist-star">{star}</span>
                    <span className="dist-track">
                      <span className="dist-fill" style={{ width: percent + "%" }}></span>
                    </span>
                    <span className="dist-pct">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="past-list">
            {latest.map((review) => (
              <ReviewCard key={review.id} review={review} eventName={eventTitle(review.eventId)}></ReviewCard>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default PastReviews;
