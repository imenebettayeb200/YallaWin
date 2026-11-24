import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import OrgAuthLayout from '../../components/org-auth/OrgAuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import OtpInput from '../../components/auth/OtpInput.jsx';
import Checkbox from '../../components/auth/Checkbox.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import BackLink from '../../components/auth/BackLink.jsx';
import DemoInbox from '../../components/auth/DemoInbox.jsx';
import Icon from '../../components/common/Icon.jsx';
import { destinationAfterLogin, maskEmail, useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../models/index.js';

const LENGTH = 6;
const RESEND_COOLDOWN = 30;
const emptyCode = () => Array(LENGTH).fill('');
const formatCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * /verify — 6-digit code after the password.
 * Organizations see the blue "FOR ORGANIZATIONS" version; attendees the colourful one.
 */
export default function TwoStepVerification() {
  const { user, pending, verifyCode, resendCode, cancelPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state && location.state.from;
  const isOrg = Boolean(pending && pending.role === ROLES.ORG);

  const [digits, setDigits] = useState(emptyCode);
  const [trust, setTrust] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN); // a code was just sent
  const otpRef = useRef(null);

  // Focus the first box when the page opens.
  useEffect(() => {
    if (otpRef.current) otpRef.current.focus(0);
  }, []);

  // Count down 1 second at a time until "Resend code" is available again.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  if (user) return <Navigate to={destinationAfterLogin(user, from)} replace />;
  if (!pending) return <Navigate to="/login" replace />;

  const code = digits.join('');
  const complete = code.length === LENGTH;
  const loginPath = isOrg ? '/login/organization' : '/login';
  const Layout = isOrg ? OrgAuthLayout : AuthLayout;

  const resetDigits = () => {
    setDigits(emptyCode());
    if (otpRef.current) otpRef.current.focus(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!complete) return;
    try {
      const signedIn = verifyCode(code, trust);
      navigate(destinationAfterLogin(signedIn, from), { replace: true });
    } catch (err) {
      if (err.fatal) {
        navigate(loginPath, { replace: true });
        return;
      }
      setError(err.message);
      resetDigits();
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    try {
      resendCode();
      setCooldown(RESEND_COOLDOWN);
      setError('');
      setInfo('A new code was sent.');
      resetDigits();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <AuthCard className={`auth-card-2fa ${isOrg ? 'auth-card-org' : ''}`} pageTitle="Two-step verification" onSubmit={handleSubmit}>
        <span className="shield-badge">
          <Icon name="shield" size={18} />
        </span>
        <h1 className="auth-title">Two-step verification</h1>
        <p className="auth-subtitle center">
          {isOrg
            ? "For your security, we sent a 6-digit code to your organization's registered email address."
            : 'For your security, we sent a 6-digit code to the email address on your account.'}
        </p>

        <p className="field-label">Enter the 6-digit code</p>
        <OtpInput
          ref={otpRef}
          value={digits}
          hasError={Boolean(error)}
          onChange={(next) => {
            setError('');
            setDigits(next);
          }}
        />
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        {!error && info && <p className="field-info">{info}</p>}

        <p className="resend">
          {cooldown > 0 ? (
            <>Resend code in {formatCountdown(cooldown)}</>
          ) : (
            <>
              Didn&apos;t get it?{' '}
              <button type="button" className="link-blue link-button" onClick={handleResend}>
                Resend code
              </button>
            </>
          )}
        </p>

        <Checkbox label="Trust this device for 30 days" checked={trust} onChange={setTrust} />
        <SubmitButton disabled={!complete} muted={!complete}>
          Verify and continue
        </SubmitButton>
        <div className="auth-divider" />
        <BackLink
          onClick={() => {
            cancelPending();
            navigate(loginPath);
          }}
        >
          Back to sign in
        </BackLink>
      </AuthCard>

      <DemoInbox to={maskEmail(pending.email)} subject="Your YallaWin verification code" code={pending.demoCode} />
    </Layout>
  );
}