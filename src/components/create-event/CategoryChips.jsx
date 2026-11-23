import { CATEGORIES } from '../../models/index.js';

export default function CategoryChips({ value, onChange }) {
  return (
    <div className="field">
      <span className="field-label">Category</span>
      <div className="chips">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className={`chip ${value === c ? 'active' : ''}`} onClick={() => onChange(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
