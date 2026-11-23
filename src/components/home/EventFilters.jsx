import Dropdown from '../common/Dropdown.jsx';

export const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Music', label: 'Music' },
  { key: 'Nightlife', label: 'Night Life' },
  { key: 'Sports', label: 'Sports' },
  { key: 'Adventure', label: 'Adventure' },
  { key: 'Tech', label: 'Tech' },
  { key: 'Workshop', label: 'Workshop' },
];

export const SORTS = [
  { key: 'soon', label: 'Soonest' },
  { key: 'popular', label: 'Most popular' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
];

/** Category chips on the left; Free toggle, City and Sort on the right. */
export default function EventFilters({ filters, onChange, cities }) {
  const set = (key) => (value) => onChange({ ...filters, [key]: value });
  return (
    <div className="filters">
      <div className="cat-chips">
        {CATEGORY_FILTERS.map((c) => (
          <button key={c.key} type="button" className={`filter-pill ${filters.category === c.key ? 'selected' : ''}`} onClick={() => set('category')(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="filters-right">
        <button type="button" className={`filter-pill toggle-pill ${filters.freeOnly ? 'active' : ''}`} onClick={() => set('freeOnly')(!filters.freeOnly)} aria-pressed={filters.freeOnly}>
          Free <span className="switch" />
        </button>
        <Dropdown label="City" value={filters.city} options={cities} onChange={set('city')} />
        <Dropdown label="Sort" value={filters.sort} options={SORTS} onChange={set('sort')} icon="sliders" />
      </div>
    </div>
  );
}
