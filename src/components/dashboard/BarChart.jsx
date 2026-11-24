import { formatDayMonth } from "../../utils";

/** Vertical bars; the last `highlight` bars use the pink→orange gradient. series: [{ date, value }] */
function BarChart({ series, highlight = 5, unit = "tickets" }) {
  const max = Math.max(1, ...series.map((d) => d.value));
  const n = series.length;
  const labelIdx = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * (n - 1)));

  return (
    <>
      <div className={`bars ${n > 60 ? "bars-dense" : ""}`}>
        {series.map((d, i) => (
          <div className="bar-slot" key={d.date.toISOString()}>
            <div
              className={`bar ${i >= n - highlight ? "bar-hot" : ""}`}
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            >
              <span className="bar-tip">
                {formatDayMonth(d.date)} · {d.value} {unit}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="bar-labels">
        {labelIdx.map((idx) => (
          <span key={idx}>{formatDayMonth(series[idx].date)}</span>
        ))}
      </div>
    </>
  );
}

export default BarChart;
