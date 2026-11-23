/** − 1 + stepper */
export default function QuantityPicker({ value, max, onChange }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="Fewer tickets">
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="More tickets">
        +
      </button>
    </div>
  );
}
