import Icon from "../common/Icon";
import Panel from "../common/Panel";

function AccountCard({ email, onLogout, onReset }) {
  return (
    <Panel className="form-panel">
      <h2 className="panel-title">Account</h2>
      <p className="muted small">Signed in as {email}</p>
      <div className="row-gap">
        <button type="button" className="btn btn-outline" onClick={onLogout}>
          <Icon name="logout" size={15} /> Sign out
        </button>
        <button type="button" className="btn btn-outline btn-danger" onClick={onReset}>
          Reset demo data
        </button>
      </div>
    </Panel>
  );
}

export default AccountCard;
