/** OrgTypeSelect — the 4 equal buttons: Company · University club · Association / NGO · Collective. */
export default function OrgTypeSelect({ options, value, onChange, error }) {
  return (
    <div className="field">
      <span className="field-label">Organization type</span>
      <div className="org-type-grid" role="radiogroup" aria-label="Organization type">
        {options.map((o) => (
          <button key={o.key} type="button" role="radio" aria-checked={value === o.key} className={`org-type ${value === o.key ? 'active' : ''}`} onClick={() => onChange(o.key)}>
            {o.label}
          </button>
        ))}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
