import { useId, useState } from 'react';
import Icon from '../common/Icon.jsx';

/** Password input with the eye button (show / hide). */
export default function PasswordField({ label = 'Password', error, labelExtra = null, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return (
    <div className="field">
      <div className="field-label-row">
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
        {labelExtra}
      </div>
      <div className="input-with-action">
        <input id={id} type={visible ? 'text' : 'password'} className={`input ${error ? 'input-error' : ''}`} {...inputProps} />
        <button type="button" className="input-action" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide password' : 'Show password'}>
          <Icon name={visible ? 'eyeOff' : 'eye'} size={17} />
        </button>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
