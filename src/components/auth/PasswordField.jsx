import { useState } from "react";
import Icon from "../common/Icon";

/* PasswordField — password input with the eye button to show / hide it. */
function PasswordField({ label, error, labelExtra, value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <div className="field-label-row">
        <span className="field-label">{label || "Password"}</span>
        {labelExtra}
      </div>
      <div className="input-with-action">
        <input
          type={visible ? "text" : "password"}
          className={error ? "input input-error" : "input"}
          aria-label={label || "Password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="input-action"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={17}></Icon>
        </button>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default PasswordField;
