import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import OrgAuthLayout from '../../components/org-auth/OrgAuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import TextField from '../../components/auth/TextField.jsx';
import PasswordField from '../../components/auth/PasswordField.jsx';
import Checkbox from '../../components/auth/Checkbox.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import Icon from '../../components/common/Icon.jsx';
import { destinationAfterLogin, homeFor, useAuth } from '../../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../../data/data.js';
import { ROLES } from '../../models/index.js';

/** /login/organization — "Sign in with your OrganizationID". */
export default function OrgLogin() {
  const { user, startLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [organizationId, setOrganizationId] = useState((location.state && location.state.organizationId) || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (user) return <Navigate to={homeFor(user)} replace />;
  const from = location.state && location.state.from;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!organizationId.trim()) errs.organizationId = 'Enter your OrganizationID.';
    if (!password) errs.password = 'Enter your password.';
    setFieldErrors(errs);
    setError('');
    if (Object.keys(errs).length) return;
    try {
      const result = startLogin({ email: organizationId, password, remember, expectRole: ROLES.ORG });
      if (result.status === '2fa') navigate('/verify', { state: { from } });
      else navigate(destinationAfterLogin(result.user, from), { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <OrgAuthLayout>
      <AuthCard
        className="auth-card-org"
        title="Sign in with your OrganizationID"
        subtitle="Log in to access your organization"
        pageTitle="Organization sign in"
        error={error}
        onSubmit={handleSubmit}
      >
        <TextField
          label="OrganizationID"
          placeholder="Your OrganizationID"
          autoComplete="username"
          value={organizationId}
          error={fieldErrors.organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        />
        <PasswordField placeholder="Enter your password" autoComplete="current-password" value={password} error={fieldErrors.password} onChange={(e) => setPassword(e.target.value)} />
        <Checkbox label="Keep me signed in" checked={remember} onChange={setRemember} />
        <SubmitButton>Sign in</SubmitButton>

        <div className="org-links">
          <Link to="/forgot-password/organization" className="link-blue">
            Forgot OrganizationID or password? <Icon name="external" size={11} />
          </Link>
          <Link to="/register/organization" className="link-blue">
            Apply to get Verified <Icon name="external" size={11} />
          </Link>
        </div>
        <div className="auth-divider" />
        <p className="auth-footer">
          Not an organization?{' '}
          <Link to="/login" className="link-underline">
            Sign in as a user
          </Link>
        </p>

        <div className="demo-row">
          <button
            type="button"
            className="demo-fill"
            onClick={() => {
              setOrganizationId(DEMO_ACCOUNTS.org.organizationId);
              setPassword(DEMO_ACCOUNTS.org.password);
            }}
          >
            Use demo organization ({DEMO_ACCOUNTS.org.organizationId})
          </button>
        </div>
      </AuthCard>
    </OrgAuthLayout>
  );
}
