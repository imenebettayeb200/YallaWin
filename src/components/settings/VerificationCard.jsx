import Icon from '../common/Icon.jsx';
import Panel from '../common/Panel.jsx';

export default function VerificationCard({ verified, onVerify }) {
  return (
    <Panel className="form-panel">
      <h2 className="panel-title">Verification</h2>
      {verified ? (
        <p className="verified big">
          <Icon name="verified" size={16} /> Your organization is verified
        </p>
      ) : (
        <>
          <p className="muted small">Verified organizations can publish events. (Demo: verification is instant.)</p>
          <button type="button" className="btn btn-gradient" onClick={onVerify}>
            Verify organization <Icon name="shield" size={15} />
          </button>
        </>
      )}
    </Panel>
  );
}
