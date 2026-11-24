import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

/**
 * OrgAuthLayout — blue "FOR ORGANIZATIONS" page used by every organization
 * screen before the dashboard (apply, under review, sign in, 2-step code, recover).
 * `wide` gives the card more room (apply wizard).
 */
export default function OrgAuthLayout({ children, top = null, wide = false }) {
  return (
    <div className="org-auth-page">
      <div className="org-auth-glow" aria-hidden="true" />
      <main className={`org-auth-content ${wide ? 'wide' : ''}`}>
        <Link to="/" className="org-auth-logo" aria-label="YallaWin home">
          <Logo subtitle="FOR ORGANIZATIONS" />
        </Link>
        {top}
        {children}
      </main>
    </div>
  );
}
