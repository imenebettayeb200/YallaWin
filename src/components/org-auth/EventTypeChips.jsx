/** EventTypeChips — "What kind of events do you host?" Several chips can be selected. */
export default function EventTypeChips({ options, value, onChange, error }) {
  const toggle = (type) => onChange(value.includes(type) ? value.filter((t) => t !== type) : [...value, type]);
  return (
    <div className="field">
      <span className="field-label">What kind of events do you host?</span>
      <div className="chips">
        {options.map((type) => (
          <button key={type} type="button" aria-pressed={value.includes(type)} className={`chip ${value.includes(type) ? 'active' : ''}`} onClick={() => toggle(type)}>
            {type}
          </button>
        ))}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
