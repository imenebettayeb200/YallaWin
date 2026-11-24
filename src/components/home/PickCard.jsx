import { cityOf, coverStyle, formatShortDate, formatTime } from "../../utils";

/* PickCard — one card of the "Top picks" carousel. offset = place from the centre (-2 to 2). */
function PickCard({ event, hostName, offset, onClick }) {
  const distance = Math.abs(offset);
  const isCenter = offset === 0;
  let shift = 0;
  if (distance === 1) shift = Math.sign(offset) * 212;
  if (distance === 2) shift = Math.sign(offset) * 400;

  const style = {
    ...coverStyle(event),
    transform: "translateX(calc(-50% + " + shift + "px)) scale(" + (isCenter ? 1 : 0.78) + ")",
    zIndex: 10 - distance,
    opacity: distance === 2 ? 0.85 : 1,
  };

  return (
    <button type="button" className={isCenter ? "pick center" : "pick"} style={style} onClick={onClick}>
      {isCenter && (
        <span className="pick-tags">
          <span className="tag tag-dark">• {event.category}</span>
          <span className="tag tag-dark">• {cityOf(event.venue)}</span>
        </span>
      )}
      <span className="pick-body">
        <span className="pick-going" aria-hidden="true">
          <span style={{ background: "#ff4d4f" }}></span>
          <span style={{ background: "#ff9a1f" }}></span>
          <span style={{ background: "#3ddc84" }}></span>
        </span>
        <span className="pick-title">{event.title}</span>
        <span className="pick-meta">
          {formatShortDate(event.date)} · {formatTime(event.startTime)}
        </span>
        <span className="pick-meta">
          {hostName} · {cityOf(event.venue)}
        </span>
      </span>
    </button>
  );
}

export default PickCard;
