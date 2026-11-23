import Icon from '../common/Icon.jsx';

/**
 * There is no email server in a frontend-only app, so the "sent" email is
 * displayed here. Replace with a real email API when you add a backend.
 */
export default function DemoInbox({ to, subject, code }) {
  if (!code) return null;
  return (
    <aside className="demo-inbox" aria-live="polite">
      <div className="demo-inbox-head">
        <Icon name="mail" size={16} />
        <span>Demo inbox</span>
        <span className="demo-inbox-to">to {to}</span>
      </div>
      <p className="demo-inbox-subject">{subject}</p>
      <p className="demo-inbox-code">{code}</p>
    </aside>
  );
}
