import { themeFor } from '../../data/artwork.js';

export default function EventThumb({ event, size = 40 }) {
  const style = { width: size, height: size };
  if (event.coverImage) {
    return <img className="event-thumb" src={event.coverImage} alt="" style={style} loading="lazy" />;
  }
  const theme = themeFor(event.category);
  return (
    <span
      className="event-thumb event-thumb-fallback"
      style={{ ...style, background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, fontSize: size * 0.5 }}
      aria-hidden="true"
    >
      {theme.emoji}
    </span>
  );
}

/** Background style for cards: cover image or category gradient. */
export function coverStyle(event) {
  const t = themeFor(event.category);
  return {
    backgroundImage: event.coverImage ? `url("${event.coverImage}")` : `linear-gradient(135deg, ${t.from}, ${t.to})`,
  };
}
