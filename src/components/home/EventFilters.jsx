import Dropdown from '../common/Dropdown.jsx';
import { CATEGORY_FILTERS, SORT_OPTIONS } from '../../data/data.js';

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
        <Dropdown label="Sort" value={filters.sort} options={SORT_OPTIONS} onChange={set('sort')} icon="sliders" />
      </div>
    </div>
  );
}