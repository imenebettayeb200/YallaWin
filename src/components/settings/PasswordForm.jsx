import { useState } from "react";
import PasswordField from "../auth/PasswordField";

/** onSubmit(current, next) returns true when the password was changed. */
function PasswordForm({ onSubmit }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit(current, next)) {
      setCurrent("");
      setNext("");
    }
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <h2 className="panel-title">Change password</h2>
      <PasswordField
        label="Current password"
        autoComplete="current-password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <PasswordField
        label="New password"
        autoComplete="new-password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <button type="submit" className="btn btn-outline" disabled={!current || !next}>
        Update password
      </button>
    </form>
  );
}

export default PasswordForm;
