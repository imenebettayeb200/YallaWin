import { DEMO_ACCOUNTS } from '../../data/seed.js';

/** Buttons that fill the login form with a demo account. */
export default function DemoAccounts({ onPick, showAttendee = true }) {
  return (
    <div className="demo-row">
      <span>Demo:</span>
      <button type="button" className="demo-fill" onClick={() => onPick(DEMO_ACCOUNTS.org)}>
        Organization (dashboard)
      </button>
      {showAttendee && (
        <button type="button" className="demo-fill" onClick={() => onPick(DEMO_ACCOUNTS.user)}>
          Attendee
        </button>
      )}
    </div>
  );
}
