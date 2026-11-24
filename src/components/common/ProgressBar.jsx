/* ProgressBar — thin bar filled from 0 to max (tickets sold / capacity). */
function ProgressBar({ value, max, color }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: percent + "%", background: color || "var(--blue)" }}></div>
    </div>
  );
}

export default ProgressBar;
