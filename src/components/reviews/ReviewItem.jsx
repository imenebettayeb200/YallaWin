import ReviewCard from './ReviewCard.jsx';
import ReplyCard from './ReplyCard.jsx';
import ReplyForm from './ReplyForm.jsx';

/** A review followed by either the reply or the reply form. */
export default function ReviewItem({ review, eventName, orgName, onReply }) {
  return (
    <div className="review-block">
      <ReviewCard review={review} eventName={eventName} />
      {review.reply ? (
        <ReplyCard orgName={orgName} reply={review.reply} />
      ) : (
        <ReplyForm authorName={review.authorName} onSubmit={(text) => onReply(review.id, text)} />
      )}
    </div>
  );
}
