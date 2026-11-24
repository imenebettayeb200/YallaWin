import { Link } from "react-router-dom";
import Logo from "../common/Logo";

/*
 * OrgAuthLayout — blue "FOR ORGANIZATIONS" page used before the dashboard
 * (apply, under review, sign in, recover). top = something above the card (the stepper).
 */
function OrgAuthLayout({ children, top, wide }) {
  return (
    <div className="org-auth-page">
      <div className="org-auth-glow" aria-hidden="true"></div>
      <main className={wide ? "org-auth-content wide" : "org-auth-content"}>
        <Link to="/" className="org-auth-logo" aria-label="YallaWin home">
          <Logo subtitle="FOR ORGANIZATIONS"></Logo>
        </Link>
        {top}
        {children}
      </main>
    </div>
  );
}

export default OrgAuthLayout;
