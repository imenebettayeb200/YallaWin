import Icon from '../common/Icon.jsx';

/** Label + input with an icon inside (title, date, time, venue). */
export default function IconField({ label, icon, error, ...inputProps }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-icon ${error ? 'input-error' : ''}`}>
        <Icon name={icon} size={15} />
        <input {...inputProps} />
      </span>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
