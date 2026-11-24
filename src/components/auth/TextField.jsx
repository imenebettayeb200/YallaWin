/* TextField — label + input + error message. The other props (type, placeholder...) go to the input. */
function TextField({ label, error, ...inputProps }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input className={error ? "input input-error" : "input"} {...inputProps} />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export default TextField;
