import Icon from "./Icon";

/* QuantityPicker — [ − 2 + ] between 1 and max. */
function QuantityPicker({ value, max, onChange }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Fewer tickets">
        <Icon name="minus" size={14}></Icon>
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="More tickets">
        <Icon name="plus" size={14}></Icon>
      </button>
    </div>
  );
}

export default QuantityPicker;
