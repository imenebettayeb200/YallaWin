import { categoryFilters, sortOptions } from "../../Data";
import Dropdown from "../common/Dropdown";

/* EventFilters — category chips on the left; Free switch, City and Sort on the right. */
function EventFilters({ filters, onChange, cities }) {
  const change = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="filters">
      <div className="cat-chips">
        {categoryFilters.map((c) => (
          <button
            key={c.key}
            type="button"
            className={filters.category === c.key ? "filter-pill selected" : "filter-pill"}
            onClick={() => change("category", c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="filters-right">
        <button
          type="button"
          className={filters.freeOnly ? "filter-pill toggle-pill active" : "filter-pill toggle-pill"}
          onClick={() => change("freeOnly", !filters.freeOnly)}
        >
          Free <span className="switch"></span>
        </button>
        <Dropdown
          label="City"
          value={filters.city}
          options={cities}
          onChange={(value) => change("city", value)}
        ></Dropdown>
        <Dropdown
          label="Sort"
          value={filters.sort}
          options={sortOptions}
          onChange={(value) => change("sort", value)}
          icon="sliders"
        ></Dropdown>
      </div>
    </div>
  );
}

export default EventFilters;
