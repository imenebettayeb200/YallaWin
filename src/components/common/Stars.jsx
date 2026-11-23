import Icon from './Icon.jsx';

export default function Stars({ rating, size = 14 }) {
  const rounded = Math.round(rating);
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} filled={i <= rounded} className={i <= rounded ? 'star-on' : 'star-off'} />
      ))}
    </span>
  );
}
