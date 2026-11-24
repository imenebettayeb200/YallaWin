import Icon from "./Icon";

/* Stars — shows a rating with 5 stars (read only). */
function Stars({ rating, size }) {
  const rounded = Math.round(rating);
  return (
    <span className="stars" aria-label={rating + " out of 5 stars"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={size || 14}
          filled={star <= rounded}
          className={star <= rounded ? "star-on" : "star-off"}
        ></Icon>
      ))}
    </span>
  );
}

export default Stars;
