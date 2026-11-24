import Avatar from "../common/Avatar";

/* LineupList — artists / speakers of the event. Nothing is shown when the lineup is empty. */
function LineupList({ lineup }) {
  if (lineup.length === 0) return null;
  return (
    <section className="detail-section">
      <h2>Lineup</h2>
      <div className="lineup">
        {lineup.map((name) => (
          <div key={name} className="lineup-item">
            <Avatar name={name} size={44}></Avatar>
            <span>{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LineupList;
