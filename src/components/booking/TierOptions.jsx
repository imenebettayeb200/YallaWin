import { formatPrice } from "../../utils";

/* TierOptions — radio list of ticket types (name, description, spots left, price). Sold-out tiers are disabled. */
function TierOptions({ tiers, value, onChange }) {
  return (
    <div className="tier-options">
      {tiers.map((tier) => {
        const left = tier.quantity - tier.sold;
        let className = "tier-option";
        if (value === tier.id) className = className + " active";
        if (left <= 0) className = className + " disabled";
        return (
          <label key={tier.id} className={className}>
            <input
              type="radio"
              name="tier"
              checked={value === tier.id}
              disabled={left <= 0}
              onChange={() => onChange(tier.id)}
            />
            <span className="tier-option-name">
              {tier.name}
              {tier.description && <small className="tier-option-desc">{tier.description}</small>}
            </span>
            <span className="tier-option-left">{left <= 0 ? "Sold out" : left + " left"}</span>
            <span className="tier-option-price">{formatPrice(tier.price)}</span>
          </label>
        );
      })}
    </div>
  );
}

export default TierOptions;
