import Icon from "../common/Icon";

/*
 * DemoInbox — there is no email server in this frontend-only project,
 * so the email that "would be sent" (with the code) is shown here.
 * Remove it when a real backend sends emails.
 */
function DemoInbox({ to, subject, code }) {
  if (!code) return null;
  return (
    <aside className="demo-inbox">
      <div className="demo-inbox-head">
        <Icon name="mail" size={16}></Icon>
        <span>Demo inbox</span>
        <span className="demo-inbox-to">to {to}</span>
      </div>
      <p className="demo-inbox-subject">{subject}</p>
      <p className="demo-inbox-code">{code}</p>
    </aside>
  );
}

export default DemoInbox;
