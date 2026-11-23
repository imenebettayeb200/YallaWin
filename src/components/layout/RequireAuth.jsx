import { Navigate, useLocation } from 'react-router-dom';
import { homeFor, useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../models/index.js';

/** Protects a route: must be signed in and have the expected role. */
export default function RequireAuth({ role, children }) {
  const { user, organization } = useAuth();
  const location = useLocation();

  if (!user) {
    const to = role === ROLES.ORG ? '/login/organization' : '/login';
    return <Navigate to={to} replace state={{ from: location.pathname }} />;
  }
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  if (role === ROLES.ORG && !organization) {
    return (
      <div className="fatal-state">
        <h1>Organization not found</h1>
        <p>This account is not linked to an organization.</p>
      </div>
    );
  }
  return children;
}
