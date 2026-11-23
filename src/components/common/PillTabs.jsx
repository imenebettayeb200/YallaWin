/** Rounded tab bar with counters, e.g. [24 All] [6 Upcoming] … */
export default function PillTabs({ tabs, value, counts = {}, onChange }) {
  return (
    <div className="pill-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          className={value === t.key ? 'active' : ''}
          onClick={() => onChange(t.key)}
        >
          {counts[t.key] !== undefined && <span className="pill-count">{counts[t.key]}</span>}
          {t.label}
        </button>
      ))}
    </div>
  );
}
