import { demoAccounts } from "../../Data";

/* DemoAccounts — buttons that fill the sign-in form with a demo account. */
function DemoAccounts({ onPick }) {
  return (
    <div className="demo-row">
      <span>Demo:</span>
      <button type="button" className="demo-fill" onClick={() => onPick(demoAccounts.user)}>
        Attendee (Sarra)
      </button>
      <button type="button" className="demo-fill" onClick={() => onPick(demoAccounts.org)}>
        Organization
      </button>
    </div>
  );
}

export default DemoAccounts;
