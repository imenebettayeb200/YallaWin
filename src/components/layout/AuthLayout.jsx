import { Link } from "react-router-dom";
import Logo from "../common/Logo";

/* AuthLayout — dark page with coloured blobs and the logo, used by the attendee sign-in screens. */
function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-blobs" aria-hidden="true">
        <span className="blob blob-purple"></span>
        <span className="blob blob-magenta"></span>
        <span className="blob blob-red"></span>
        <span className="blob blob-orange"></span>
        <span className="blob blob-blue"></span>
      </div>
      <main className="auth-content">
        <Link to="/" className="auth-logo" aria-label="YallaWin home">
          <Logo></Logo>
        </Link>
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
