import { Link } from 'react-router-dom';
import Panel from '../common/Panel.jsx';

export default function PayoutMethodCard({ payoutMethod }) {
  const hasBank = Boolean(payoutMethod && payoutMethod.bank.trim());
  return (
    <Panel className="bank-panel">
      <div>
        <h2 className="panel-title">Payout method</h2>
        {hasBank ? (
          <p className="muted">
            {payoutMethod.holder} · {payoutMethod.bank}
          </p>
        ) : (
          <p className="text-red small">No bank account yet — add one in settings to receive payouts.</p>
        )}
      </div>
      <Link to="/org/settings" className="btn btn-outline">
        {hasBank ? 'Edit' : 'Add bank details'}
      </Link>
    </Panel>
  );
}
