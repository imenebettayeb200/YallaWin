import Icon from '../common/Icon.jsx';

/** "All events" select used to filter reviews. options: [{ id, name }] */
export default function EventSelect({ value, options, onChange }) {
  return (
    <label className="select-wrap">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Filter by event">
        <option value="all">All events</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={14} />
    </label>
  );
}
