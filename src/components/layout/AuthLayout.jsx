import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

/** Dark page with coloured blurred blobs and the serif logo (login / 2-step screens). */
export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-blobs" aria-hidden="true">
        <span className="blob blob-purple" />
        <span className="blob blob-magenta" />
        <span className="blob blob-red" />
        <span className="blob blob-orange" />
        <span className="blob blob-blue" />
      </div>
      <main className="auth-content">
        <Link to="/" className="auth-logo" aria-label="YallaWin home">
          <Logo />
        </Link>
        {children}
      </main>
    </div>
  );
}
