import { formatTND } from '../../utils/format.js';

/** Radio list of ticket types with remaining count and price. */
export default function TierOptions({ tiers, value, onChange }) {
  return (
    <div className="tier-options">
      {tiers.map((t) => {
        const left = t.quantity - t.sold;
        return (
          <label key={t.id} className={`tier-option ${value === t.id ? 'active' : ''} ${left <= 0 ? 'disabled' : ''}`}>
            <input type="radio" name="tier" value={t.id} checked={value === t.id} disabled={left <= 0} onChange={() => onChange(t.id)} />
            <span className="tier-option-name">{t.name}</span>
            <span className="tier-option-left">{left <= 0 ? 'Sold out' : `${left} left`}</span>
            <span className="tier-option-price">{t.price === 0 ? 'Free' : formatTND(t.price)}</span>
          </label>
        );
      })}
    </div>
  );
}
