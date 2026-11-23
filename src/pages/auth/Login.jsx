import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import TextField from '../../components/auth/TextField.jsx';
import PasswordField from '../../components/auth/PasswordField.jsx';
import Checkbox from '../../components/auth/Checkbox.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import AuthFooter from '../../components/auth/AuthFooter.jsx';
import DemoAccounts from '../../components/auth/DemoAccounts.jsx';
import { destinationAfterLogin, homeFor, useAuth } from '../../context/AuthContext.jsx';
import { isValidEmail, ROLES } from '../../models/index.js';

export default function Login({ mode = 'user' }) {
  const { user, startLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isOrg = mode === 'org';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={homeFor(user)} replace />;
  const from = location.state && location.state.from;

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!isValidEmail(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Enter your password.';
    setFieldErrors(errs);
    setError('');
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const result = startLogin({ email, password, remember, expectRole: isOrg ? ROLES.ORG : null });
      if (result.status === '2fa') navigate('/verify', { state: { from } });
      else navigate(destinationAfterLogin(result.user, from), { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title={isOrg ? 'Sign in to your organization' : 'Sign in to your account'}
        subtitle="Log in with your email and password"
        error={error}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          error={fieldErrors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          error={fieldErrors.password}
          onChange={(e) => setPassword(e.target.value)}
          labelExtra={
            <Link to="/forgot-password" className="link-blue small">
              Forgot password?
            </Link>
          }
        />
        <Checkbox label="Keep me signed in" checked={remember} onChange={setRemember} />
        <SubmitButton disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</SubmitButton>

        <AuthFooter
          question="New to YallaWin?"
          linkText="Create account"
          linkTo={isOrg ? '/register/organization' : '/register'}
          externalIcon
          switchText={isOrg ? 'Going to events?' : 'Hosting events for a club or company?'}
          switchLinkText={isOrg ? 'Sign in as an attendee' : 'Sign in as an organization'}
          switchTo={isOrg ? '/login' : '/login/organization'}
        />

        <DemoAccounts
          showAttendee={!isOrg}
          onPick={(account) => {
            setEmail(account.email);
            setPassword(account.password);
          }}
        />
      </AuthCard>
    </AuthLayout>
  );
}
