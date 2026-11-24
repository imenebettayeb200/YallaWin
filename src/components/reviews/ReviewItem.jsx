import ReviewCard from "./ReviewCard";
import ReplyCard from "./ReplyCard";
import ReplyForm from "./ReplyForm";

/** A review followed by either the reply or the reply form. */
function ReviewItem({ review, eventName, orgName, onReply }) {
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

export default ReviewItem;
