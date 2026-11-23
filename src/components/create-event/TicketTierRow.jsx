import Icon from '../common/Icon.jsx';

const toNumber = (value, integer) => {
  if (value === '') return '';
  const n = integer ? parseInt(value, 10) : parseFloat(value);
  return Number.isNaN(n) ? '' : Math.max(0, n);
};

/** Editable row: name | price TND | quantity tickets | delete */
export default function TicketTierRow({ tier, error, onChange, onRemove }) {
  return (
    <div>
      <div className={`tier-row ${error ? 'input-error' : ''}`}>
        <Icon name="ticketPlain" size={15} />
        <input className="tier-name" value={tier.name} placeholder="Tier name" aria-label="Tier name" onChange={(e) => onChange({ name: e.target.value })} />
        <span className="tier-num">
          <input type="number" min="0" step="1" value={tier.price} aria-label="Price in TND" onChange={(e) => onChange({ price: toNumber(e.target.value, false) })} />
          <span>TND</span>
        </span>
        <span className="tier-num">
          <input type="number" min="1" step="1" value={tier.quantity} aria-label="Number of tickets" onChange={(e) => onChange({ quantity: toNumber(e.target.value, true) })} />
          <span>tickets</span>
        </span>
        <button type="button" className="round-btn" onClick={onRemove} aria-label={`Remove ${tier.name}`}>
          <Icon name="trash" size={13} />
        </button>
      </div>
      {tier.sold > 0 && <span className="field-hint">{tier.sold} sold</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
