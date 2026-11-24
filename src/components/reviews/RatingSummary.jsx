import Panel from "../common/Panel";
import Stars from "../common/Stars";

function DistributionBar({ star, pct }) {
  return (
    <li>
      <span className="dist-star">{star}</span>
      <span className="dist-track">
        <span className="dist-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="dist-pct">{pct}%</span>
    </li>
  );
}

/** Big "4.7" card with stars and the 5→1 distribution. */
function RatingSummary({ avg, total, goAgain, distribution }) {
  return (
    <Panel className="rating-panel">
      <p className="rating-big">{avg.toFixed(1)}</p>
      <Stars rating={avg} size={15} />
      <p className="muted small">
        {total} reviews · {goAgain}% would go again
      </p>
      <ul className="dist">
        {distribution.map((d) => (
          <DistributionBar key={d.star} star={d.star} pct={d.pct} />
        ))}
      </ul>
    </Panel>
  );
}

export default RatingSummary;
