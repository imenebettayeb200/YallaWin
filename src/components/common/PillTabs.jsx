/* PillTabs — rounded tab bar, e.g. [24 All] [6 Upcoming]. counts is optional. */
function PillTabs({ tabs, value, counts, onChange }) {
  return (
    <div className="pill-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          className={value === tab.key ? "active" : ""}
          onClick={() => onChange(tab.key)}
        >
          {counts && counts[tab.key] !== undefined && <span className="pill-count">{counts[tab.key]}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default PillTabs;
