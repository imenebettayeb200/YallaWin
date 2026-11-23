/** Label + input + error message. Extra props go to the <input>. */
export default function TextField({ label, error, labelExtra = null, ...inputProps }) {
  return (
    <label className="field">
      {labelExtra ? (
        <span className="field-label-row">
          <span className="field-label">{label}</span>
          {labelExtra}
        </span>
      ) : (
        <span className="field-label">{label}</span>
      )}
      <input className={`input ${error ? 'input-error' : ''}`} {...inputProps} />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
